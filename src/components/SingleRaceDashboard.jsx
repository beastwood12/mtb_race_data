import React, { useState, useMemo } from 'react';

export default function SingleRaceDashboard({ raceData, raceInfo }) {
  const [activeTab, setActiveTab] = useState('charts');
  const [f, setF] = useState({div: 'all', cat: 'all', gen: 'all', team: 'all', search: ''});
  const [chartF, setChartF] = useState({div: 'all', team: 'all', gen: 'all', cat: 'all'});
  const [s, setS] = useState({k: 'PLC', d: 'asc'});

  const DATA = raceData;

  const filtered = useMemo(() => {
    let d = DATA.filter(x => 
      (f.div === 'all' || x.Division === f.div) &&
      (f.cat === 'all' || x.CAT === f.cat) &&
      (f.gen === 'all' || x.GENDER === f.gen) &&
      (f.team === 'all' || x.Team === f.team) &&
      (f.search === '' || x.NAME.toLowerCase().includes(f.search.toLowerCase()) || x.Team.toLowerCase().includes(f.search.toLowerCase()))
    );
    d.sort((a,b) => {
      let av = a[s.k], bv = b[s.k];
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (s.d === 'asc') return av > bv ? 1 : -1;
      return av < bv ? 1 : -1;
    });
    return d;
  }, [f, s]);

  const stats = useMemo(() => ({
    tot: filtered.length,
    teams: new Set(filtered.map(x => x.Team)).size,
    avg: filtered.length > 0 ? Math.round(filtered.reduce((a,x) => a + x.PTS, 0) / filtered.length) : 0,
    m: filtered.filter(x => x.GENDER === 'M').length,
    f: filtered.filter(x => x.GENDER === 'F').length
  }), [filtered]);

  const chartFiltered = useMemo(() => 
    DATA.filter(x => 
      (chartF.div === 'all' || x.Division === chartF.div) &&
      (chartF.team === 'all' || x.Team === chartF.team) &&
      (chartF.gen === 'all' || x.GENDER === chartF.gen) &&
      (chartF.cat === 'all' || x.CAT === chartF.cat)
    ), [chartF]);

  const chartData = useMemo(() => {
    const d = chartFiltered;
    
    const catCounts = {};
    d.forEach(x => catCounts[x.CAT] = (catCounts[x.CAT] || 0) + 1);
    const byCategory = Object.entries(catCounts).map(([name, count]) => ({name, count})).sort((a,b) => b.count - a.count);

    const teamCounts = {};
    d.forEach(x => teamCounts[x.Team] = (teamCounts[x.Team] || 0) + 1);
    const byTeam = Object.entries(teamCounts).map(([name, count]) => ({
      name: name.length > 20 ? name.slice(0,17)+'...' : name, 
      count
    })).sort((a,b) => b.count - a.count).slice(0,10);

    const genCounts = {};
    d.forEach(x => genCounts[x.GENDER] = (genCounts[x.GENDER] || 0) + 1);
    const byGender = Object.entries(genCounts).map(([name, count]) => ({name: name === 'M' ? 'Male' : 'Female', count}));

    const gradeCounts = {};
    d.forEach(x => gradeCounts[x.GRD] = (gradeCounts[x.GRD] || 0) + 1);
    const byGrade = Object.entries(gradeCounts).map(([name, count]) => ({name: `Grade ${name}`, count})).sort((a,b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));

    const catLapTimes = {};
    d.forEach(x => {
      if (!catLapTimes[x.CAT]) catLapTimes[x.CAT] = {sum: 0, count: 0};
      if (x.TOTAL_TIME > 0 && x.NUM_LAPS > 0) {
        catLapTimes[x.CAT].sum += x.TOTAL_TIME / x.NUM_LAPS;
        catLapTimes[x.CAT].count++;
      }
    });
    const avgLapCategory = Object.entries(catLapTimes).map(([name, data]) => ({
      name, 
      avg: data.count > 0 ? (data.sum / data.count / 60).toFixed(1) : 0
    })).sort((a,b) => parseFloat(a.avg) - parseFloat(b.avg));

    // NEW: Scatter plot data - Elevation vs Race Time
    const elevationScatter = d
      .filter(x => x.School_Elevation && x.TOTAL_TIME > 0)
      .map(x => ({
        elevation: x.School_Elevation,
        time: x.TOTAL_TIME / 60, // Convert to minutes
        team: x.Team,
        name: x.NAME
      }));

    return {byCategory, byTeam, byGender, byGrade, avgLapCategory, elevationScatter};
  }, [chartFiltered]);

  const u = useMemo(() => ({
    divs: [...new Set(DATA.map(x => x.Division))].sort(),
    cats: [...new Set(DATA.map(x => x.CAT))].sort(),
    teams: [...new Set(DATA.map(x => x.Team))].sort()
  }), []);

  const sort = (k) => {
    if (s.k === k) setS({k, d: s.d === 'asc' ? 'desc' : 'asc'});
    else setS({k, d: 'asc'});
  };

  const fmt = (sec) => sec > 0 ? `${Math.floor(sec/60)}:${String(Math.floor(sec%60)).padStart(2,'0')}` : '-';

  const BarChart = ({data, title, color = 'orange'}) => {
    const max = Math.max(...data.map(d => parseFloat(d.count || d.avg)));
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
        <h3 className="font-bold text-sm mb-3 text-gray-700">{title}</h3>
        <div className="space-y-1">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="text-xs w-32 truncate" title={item.name}>{item.name}</div>
              <div className="flex-1 bg-gray-100 rounded h-5 relative">
                <div 
                  className={`h-full rounded flex items-center justify-end px-2 transition-all duration-300`}
                  style={{
                    width: `${((parseFloat(item.count || item.avg)) / max) * 100}%`,
                    backgroundColor: color === 'orange' ? '#f97316' : color === 'blue' ? '#3b82f6' : color === 'green' ? '#22c55e' : '#a855f7'
                  }}
                >
                  <span className="text-xs font-semibold text-white">{item.count || item.avg}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ScatterPlot = ({data, title}) => {
    if (!data || data.length === 0) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
          <h3 className="font-bold text-sm mb-3 text-gray-700">{title}</h3>
          <div className="text-sm text-gray-500 text-center py-8">No elevation data available</div>
        </div>
      );
    }

    const minElev = Math.min(...data.map(d => d.elevation));
    const maxElev = Math.max(...data.map(d => d.elevation));
    const minTime = Math.min(...data.map(d => d.time));
    const maxTime = Math.max(...data.map(d => d.time));
    
    const elevRange = maxElev - minElev;
    const timeRange = maxTime - minTime;

    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
        <h3 className="font-bold text-sm mb-3 text-gray-700">{title}</h3>
        <div className="relative" style={{height: '300px', padding: '20px 40px 40px 50px'}}>
          {/* Y-axis label */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs font-semibold text-gray-600">
            School Elevation (feet)
          </div>
          
          {/* X-axis label */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-600">
            Race Time (minutes)
          </div>

          {/* Plot area */}
          <div className="relative w-full h-full border-l-2 border-b-2 border-gray-300">
            {/* Y-axis ticks */}
            <div className="absolute left-0 top-0 -ml-10 text-xs text-gray-600">{maxElev.toLocaleString()}</div>
            <div className="absolute left-0 top-1/2 -ml-10 text-xs text-gray-600">{Math.round((maxElev + minElev) / 2).toLocaleString()}</div>
            <div className="absolute left-0 bottom-0 -ml-10 text-xs text-gray-600">{minElev.toLocaleString()}</div>

            {/* X-axis ticks */}
            <div className="absolute bottom-0 left-0 -mb-6 text-xs text-gray-600">{Math.round(minTime)}</div>
            <div className="absolute bottom-0 left-1/2 -ml-8 -mb-6 text-xs text-gray-600">{Math.round((maxTime + minTime) / 2)}</div>
            <div className="absolute bottom-0 right-0 -mb-6 text-xs text-gray-600">{Math.round(maxTime)}</div>

            {/* Data points */}
            {data.map((point, i) => {
              const x = ((point.time - minTime) / timeRange) * 100;
              const y = 100 - ((point.elevation - minElev) / elevRange) * 100;
              
              return (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full cursor-pointer hover:scale-150 transition-transform"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    backgroundColor: '#800020',
                    opacity: 0.6
                  }}
                  title={`${point.team}: ${point.elevation.toLocaleString()} ft, ${point.time.toFixed(1)} min`}
                />
              );
            })}
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Each dot represents a rider • Hover for details
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 text-white" style={{backgroundColor: '#FFD700'}}>
          <h1 className="text-2xl font-bold text-gray-900">🚵 {raceInfo?.name || "Race Results"}</h1>
          <p className="text-sm mt-1 text-gray-800">{raceInfo?.location || ""} • {raceInfo?.date || ""} • {DATA.length} riders</p>
        </div>

        <div className="bg-white h-3"></div>

        {/* Tab Navigation */}
        <div className="bg-white border-b-2 border-gray-200 px-2">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('charts')}
              className={`px-6 py-3 text-sm font-bold rounded-t-lg transition-all ${
                activeTab === 'charts' 
                  ? 'text-white shadow-lg' 
                  : 'hover:opacity-80'
              }`}
              style={activeTab === 'charts' ? {backgroundColor: '#800020', color: 'white'} : {backgroundColor: '#d4a5a5', color: '#800020'}}
            >
              📈 Analytics
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-6 py-3 text-sm font-bold rounded-t-lg transition-all ${
                activeTab === 'table' 
                  ? 'text-white shadow-lg' 
                  : 'hover:opacity-80'
              }`}
              style={activeTab === 'table' ? {backgroundColor: '#228B22', color: 'white'} : {backgroundColor: '#a8d5a8', color: '#228B22'}}
            >
              📊 Individual Results
            </button>
          </div>
        </div>

        {activeTab === 'table' ? (
          <>
            <div className="grid grid-cols-5 gap-2 p-3 border-b text-center text-xs" style={{backgroundColor: '#FFF8DC'}}>
              <div><div className="text-2xl font-bold" style={{color: '#800020'}}>{stats.tot}</div><div className="text-gray-600 font-semibold">Riders</div></div>
              <div><div className="text-2xl font-bold" style={{color: '#800020'}}>{stats.teams}</div><div className="text-gray-600 font-semibold">Teams</div></div>
              <div><div className="text-2xl font-bold" style={{color: '#800020'}}>{stats.avg}</div><div className="text-gray-600 font-semibold">Avg Pts</div></div>
              <div><div className="text-2xl font-bold text-blue-600">{stats.m}</div><div className="text-gray-600 font-semibold">Male</div></div>
              <div><div className="text-2xl font-bold text-pink-600">{stats.f}</div><div className="text-gray-600 font-semibold">Female</div></div>
            </div>

            <div className="p-3 border-b bg-gray-50">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <select value={f.div} onChange={(e) => setF({...f, div: e.target.value})} className="px-3 py-2 text-xs border-2 border-gray-300 rounded-lg focus:outline-none" style={{borderColor: f.div !== 'all' ? '#800020' : undefined}}>
                  <option value="all">All Divisions</option>
                  {u.divs.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={f.cat} onChange={(e) => setF({...f, cat: e.target.value})} className="px-3 py-2 text-xs border-2 border-gray-300 rounded-lg focus:outline-none" style={{borderColor: f.cat !== 'all' ? '#800020' : undefined}}>
                  <option value="all">All Categories</option>
                  {u.cats.map(c => <option key={c} value={c}>{c.length > 15 ? c.slice(0,12)+'...' : c}</option>)}
                </select>
                <select value={f.gen} onChange={(e) => setF({...f, gen: e.target.value})} className="px-3 py-2 text-xs border-2 border-gray-300 rounded-lg focus:outline-none" style={{borderColor: f.gen !== 'all' ? '#800020' : undefined}}>
                  <option value="all">All Genders</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
                <select value={f.team} onChange={(e) => setF({...f, team: e.target.value})} className="px-3 py-2 text-xs border-2 border-gray-300 rounded-lg focus:outline-none" style={{borderColor: f.team !== 'all' ? '#800020' : undefined}}>
                  <option value="all">All Teams</option>
                  {u.teams.map(t => <option key={t} value={t}>{t.length > 20 ? t.slice(0,17)+'...' : t}</option>)}
                </select>
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={f.search}
                  onChange={(e) => setF({...f, search: e.target.value})}
                  className="px-3 py-2 text-xs border-2 border-gray-300 rounded-lg focus:outline-none"
                  style={{borderColor: f.search ? '#800020' : undefined}}
                />
              </div>
            </div>

            <div className="overflow-x-auto" style={{maxHeight: '70vh'}}>
              <table className="w-full text-xs">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-200 sticky top-0">
                  <tr>
                    <th onClick={() => sort('PLC')} className="px-2 py-2 text-left cursor-pointer hover:bg-gray-300 font-bold">Placement {s.k === 'PLC' && (s.d === 'asc' ? '↑' : '↓')}</th>
                    <th onClick={() => sort('NAME')} className="px-2 py-2 text-left cursor-pointer hover:bg-gray-300 font-bold">Rider {s.k === 'NAME' && (s.d === 'asc' ? '↑' : '↓')}</th>
                    <th onClick={() => sort('Team')} className="px-2 py-2 text-left cursor-pointer hover:bg-gray-300 font-bold">Team {s.k === 'Team' && (s.d === 'asc' ? '↑' : '↓')}</th>
                    <th onClick={() => sort('CAT')} className="px-2 py-2 text-left cursor-pointer hover:bg-gray-300 font-bold">Race Category {s.k === 'CAT' && (s.d === 'asc' ? '↑' : '↓')}</th>
                    <th onClick={() => sort('GENDER')} className="px-2 py-2 cursor-pointer hover:bg-gray-300 font-bold">Gender {s.k === 'GENDER' && (s.d === 'asc' ? '↑' : '↓')}</th>
                    <th onClick={() => sort('GRD')} className="px-2 py-2 cursor-pointer hover:bg-gray-300 font-bold">Grade {s.k === 'GRD' && (s.d === 'asc' ? '↑' : '↓')}</th>
                    <th onClick={() => sort('PTS')} className="px-2 py-2 cursor-pointer hover:bg-gray-300 font-bold">Pts {s.k === 'PTS' && (s.d === 'asc' ? '↑' : '↓')}</th>
                    <th onClick={() => sort('TOTAL_TIME')} className="px-2 py-2 cursor-pointer hover:bg-gray-300 font-bold">Time (Minutes) {s.k === 'TOTAL_TIME' && (s.d === 'asc' ? '↑' : '↓')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={i} className="border-b hover:bg-green-50 transition-colors">
                      <td className="px-2 py-2 font-semibold">{r.PLC}</td>
                      <td className="px-2 py-2">{r.NAME}</td>
                      <td className="px-2 py-2">{r.Team.length > 20 ? r.Team.slice(0,17)+'...' : r.Team}</td>
                      <td className="px-2 py-2 text-xs">{r.CAT.slice(0,10)}</td>
                      <td className="px-2 py-2"><span className={`px-2 py-0.5 rounded font-semibold text-xs ${r.GENDER === 'M' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>{r.GENDER}</span></td>
                      <td className="px-2 py-2 text-center">{r.GRD}</td>
                      <td className="px-2 py-2 font-semibold">{r.PTS}</td>
                      <td className="px-2 py-2">{fmt(r.TOTAL_TIME)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 border-b" style={{backgroundColor: '#FFF8DC'}}>
              <div className="flex gap-3 items-center flex-wrap">
                <div className="text-sm font-bold text-gray-700">Filter:</div>
                <select value={chartF.div} onChange={(e) => setChartF({...chartF, div: e.target.value})} className="px-4 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none font-semibold" style={{borderColor: '#800020'}}>
                  <option value="all">All Divisions</option>
                  {u.divs.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={chartF.team} onChange={(e) => setChartF({...chartF, team: e.target.value})} className="px-4 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none font-semibold" style={{borderColor: '#800020'}}>
                  <option value="all">All Teams</option>
                  {u.teams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select value={chartF.gen} onChange={(e) => setChartF({...chartF, gen: e.target.value})} className="px-4 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none font-semibold" style={{borderColor: '#800020'}}>
                  <option value="all">All Genders</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
                <select value={chartF.cat} onChange={(e) => setChartF({...chartF, cat: e.target.value})} className="px-4 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none font-semibold" style={{borderColor: '#800020'}}>
                  <option value="all">All Categories</option>
                  {u.cats.map(c => <option key={c} value={c}>{c.length > 20 ? c.slice(0,17)+'...' : c}</option>)}
                </select>
                <div className="ml-auto px-4 py-2 bg-white rounded-lg border-2 text-sm font-bold" style={{borderColor: '#FFD700', color: '#800020'}}>
                  📊 {chartFiltered.length} riders
                </div>
              </div>
            </div>

            <div className="p-4 overflow-y-auto bg-gray-50" style={{maxHeight: '75vh'}}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BarChart data={chartData.byCategory} title="🏁 Riders per Category" color="orange" />
                <BarChart data={chartData.byTeam} title="🏫 Riders Per Team" color="orange" />
                <BarChart data={chartData.byGender} title="👥 Gender Distribution" color="blue" />
                <BarChart data={chartData.byGrade} title="🎓 Riders per Grade" color="green" />
                <BarChart data={chartData.avgLapCategory} title="⏱️ Avg Lap Time by Category (min)" color="purple" />
                <div className="lg:col-span-2">
                  <ScatterPlot data={chartData.elevationScatter} title="🏔️ School Elevation vs. Race Time" />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="p-3 text-center text-xs font-semibold text-gray-900" style={{backgroundColor: '#FFD700'}}>
          🚵 Utah HS Mountain Bike Racing • {DATA.length} total riders • {raceInfo?.name || "Race Results"}
        </div>
      </div>
    </div>
  );
}
