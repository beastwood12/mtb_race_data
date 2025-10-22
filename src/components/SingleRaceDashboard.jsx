import React, { useState, useMemo } from 'react';

export default function SingleRaceDashboard({ raceData, raceInfo }) {
  const [activeTab, setActiveTab] = useState('charts');
  const [f, setF] = useState({div: 'all', cat: 'all', gen: 'all', team: 'all', search: ''});
  const [chartF, setChartF] = useState({div: 'all', team: 'all'});
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
  }, [f, s, DATA]);

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
      (chartF.team === 'all' || x.Team === chartF.team)
    ), [chartF, DATA]);

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
    })).sort((a,b) => b.count - a.count).slice(0,15);

    const genCounts = {};
    d.forEach(x => genCounts[x.GENDER] = (genCounts[x.GENDER] || 0) + 1);
    const byGender = Object.entries(genCounts).map(([name, count]) => ({name: name === 'M' ? 'Male' : 'Female', count}));

    const gradeCounts = {};
    d.forEach(x => gradeCounts[x.GRD] = (gradeCounts[x.GRD] || 0) + 1);
    const byGrade = Object.entries(gradeCounts).map(([name, count]) => ({name: `Grade ${name}`, count})).sort((a,b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));

    // Average lap times
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

    const divLapTimes = {};
    d.forEach(x => {
      if (!divLapTimes[x.Division]) divLapTimes[x.Division] = {sum: 0, count: 0};
      if (x.TOTAL_TIME > 0 && x.NUM_LAPS > 0) {
        divLapTimes[x.Division].sum += x.TOTAL_TIME / x.NUM_LAPS;
        divLapTimes[x.Division].count++;
      }
    });
    const avgLapDivision = Object.entries(divLapTimes).map(([name, data]) => ({
      name, 
      avg: data.count > 0 ? (data.sum / data.count / 60).toFixed(1) : 0
    })).sort((a,b) => parseFloat(a.avg) - parseFloat(b.avg));

    const teamLapTimes = {};
    d.forEach(x => {
      const teamName = x.Team;
      if (!teamLapTimes[teamName]) teamLapTimes[teamName] = {sum: 0, count: 0};
      if (x.TOTAL_TIME > 0 && x.NUM_LAPS > 0) {
        teamLapTimes[teamName].sum += x.TOTAL_TIME / x.NUM_LAPS;
        teamLapTimes[teamName].count++;
      }
    });
    const avgLapTeam = Object.entries(teamLapTimes).map(([name, data]) => ({
      name: name.length > 20 ? name.slice(0,17)+'...' : name, 
      avg: data.count > 0 ? (data.sum / data.count / 60).toFixed(1) : 0
    })).sort((a,b) => parseFloat(a.avg) - parseFloat(b.avg)).slice(0,15);

    const gradeLapTimes = {};
    d.forEach(x => {
      if (!gradeLapTimes[x.GRD]) gradeLapTimes[x.GRD] = {sum: 0, count: 0};
      if (x.TOTAL_TIME > 0 && x.NUM_LAPS > 0) {
        gradeLapTimes[x.GRD].sum += x.TOTAL_TIME / x.NUM_LAPS;
        gradeLapTimes[x.GRD].count++;
      }
    });
    const avgLapGrade = Object.entries(gradeLapTimes).map(([name, data]) => ({
      name: `Grade ${name}`, 
      avg: data.count > 0 ? (data.sum / data.count / 60).toFixed(1) : 0
    })).sort((a,b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));

    return {byCategory, byTeam, byGender, byGrade, avgLapCategory, avgLapDivision, avgLapTeam, avgLapGrade};
  }, [chartFiltered]);

  const u = useMemo(() => ({
    divs: [...new Set(DATA.map(x => x.Division))].sort(),
    cats: [...new Set(DATA.map(x => x.CAT))].sort(),
    teams: [...new Set(DATA.map(x => x.Team))].sort()
  }), [DATA]);

  const sort = (k) => {
    if (s.k === k) setS({k, d: s.d === 'asc' ? 'desc' : 'asc'});
    else setS({k, d: 'asc'});
  };

  const fmt = (sec) => sec > 0 ? `${Math.floor(sec/60)}:${String(Math.floor(sec%60)).padStart(2,'0')}` : '-';

  const BarChart = ({data, title, xLabel, color = 'orange'}) => {
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
                  className={`bg-${color}-500 h-full rounded flex items-center justify-end px-2 transition-all duration-300`}
                  style={{width: `${((parseFloat(item.count || item.avg)) / max) * 100}%`}}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4">
          <h1 className="text-2xl font-bold">🚵 {raceInfo.name}</h1>
          <p className="text-sm opacity-90 mt-1">{raceInfo.location} • {raceInfo.date} • {DATA.length} riders</p>
        </div>

        {/* Spacer */}
        <div className="bg-white h-3"></div>

        {/* Tab Navigation */}
        <div className="bg-white border-b-2 border-gray-200 px-2">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('charts')}
              className={`px-6 py-3 text-sm font-bold rounded-t-lg transition-all ${
                activeTab === 'charts' 
                  ? 'bg-gradient-to-b from-orange-500 to-orange-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
              }`}
            >
              📈 Analytics & Charts
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-6 py-3 text-sm font-bold rounded-t-lg transition-all ${
                activeTab === 'table' 
                  ? 'bg-gradient-to-b from-orange-500 to-orange-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
              }`}
            >
              📊 Results Table
            </button>
          </div>
        </div>

        {activeTab === 'table' ? (
          <>
            <div className="grid grid-cols-5 gap-2 p-3 bg-gradient-to-r from-orange-50 to-red-50 border-b text-center text-xs">
              <div><div className="text-2xl font-bold text-orange-600">{stats.tot}</div><div className="text-gray-600 font-semibold">Riders</div></div>
              <div><div className="text-2xl font-bold text-orange-600">{stats.teams}</div><div className="text-gray-600 font-semibold">Teams</div></div>
              <div><div className="text-2xl font-bold text-orange-600">{stats.avg}</div><div className="text-gray-600 font-semibold">Avg Pts</div></div>
              <div><div className="text-2xl font-bold text-blue-600">{stats.m}</div><div className="text-gray-600 font-semibold">Male</div></div>
              <div><div className="text-2xl font-bold text-pink-600">{stats.f}</div><div className="text-gray-600 font-semibold">Female</div></div>
            </div>

            <div className="p-3 border-b bg-gray-50">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <select value={f.div} onChange={(e) => setF({...f, div: e.target.value})} className="px-3 py-2 text-xs border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none">
                  <option value="all">All Divisions</option>
                  {u.divs.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={f.cat} onChange={(e) => setF({...f, cat: e.target.value})} className="px-3 py-2 text-xs border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none">
                  <option value="all">All Categories</option>
                  {u.cats.map(c => <option key={c} value={c}>{c.length > 15 ? c.slice(0,12)+'...' : c}</option>)}
                </select>
                <select value={f.gen} onChange={(e) => setF({...f, gen: e.target.value})} className="px-3 py-2 text-xs border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none">
                  <option value="all">All</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
                <select value={f.team} onChange={(e) => setF({...f, team: e.target.value})} className="px-3 py-2 text-xs border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none">
                  <option value="all">All Teams</option>
                  {u.teams.map(t => <option key={t} value={t}>{t.length > 20 ? t.slice(0,17)+'...' : t}</option>)}
                </select>
                <input 
                  type="text" 
                  placeholder="Search rider/team..." 
                  value={f.search}
                  onChange={(e) => setF({...f, search: e.target.value})}
                  className="px-3 py-2 text-xs border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto" style={{maxHeight: '70vh'}}>
              <table className="w-full text-xs">
                <thead className="bg-gradient-to-r from-gray-100 to-gray-200 sticky top-0">
                  <tr>
                    <th onClick={() => sort('PLC')} className="px-2 py-2 text-left cursor-pointer hover:bg-gray-300 font-bold">Pl {s.k === 'PLC' && (s.d === 'asc' ? '↑' : '↓')}</th>
                    <th onClick={() => sort('NAME')} className="px-2 py-2 text-left cursor-pointer hover:bg-gray-300 font-bold">Rider {s.k === 'NAME' && (s.d === 'asc' ? '↑' : '↓')}</th>
                    <th onClick={() => sort('Team')} className="px-2 py-2 text-left cursor-pointer hover:bg-gray-300 font-bold">Team {s.k === 'Team' && (s.d === 'asc' ? '↑' : '↓')}</th>
                    <th className="px-2 py-2 font-bold">Div</th>
                    <th className="px-2 py-2 text-left font-bold">Category</th>
                    <th className="px-2 py-2 font-bold">Gender</th>
                    <th onClick={() => sort('GRD')} className="px-2 py-2 cursor-pointer hover:bg-gray-300 font-bold">Gr {s.k === 'GRD' && (s.d === 'asc' ? '↑' : '↓')}</th>
                    <th onClick={() => sort('PTS')} className="px-2 py-2 cursor-pointer hover:bg-gray-300 font-bold">Pts {s.k === 'PTS' && (s.d === 'asc' ? '↑' : '↓')}</th>
                    <th onClick={() => sort('TOTAL_TIME')} className="px-2 py-2 cursor-pointer hover:bg-gray-300 font-bold">Time {s.k === 'TOTAL_TIME' && (s.d === 'asc' ? '↑' : '↓')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={i} className="border-b hover:bg-orange-50 transition-colors">
                      <td className="px-2 py-2 font-semibold">{r.PLC}</td>
                      <td className="px-2 py-2">{r.NAME}</td>
                      <td className="px-2 py-2">{r.Team.length > 25 ? r.Team.slice(0,22)+'...' : r.Team}</td>
                      <td className="px-2 py-2"><span className="px-2 py-0.5 bg-orange-100 text-orange-800 rounded font-semibold">{r.Division}</span></td>
                      <td className="px-2 py-2">{r.CAT}</td>
                      <td className="px-2 py-2"><span className={`px-2 py-0.5 rounded font-semibold ${r.GENDER === 'M' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>{r.GENDER === 'M' ? 'M' : 'F'}</span></td>
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
            {/* Charts Tab */}
            <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex gap-3 items-center">
                <div className="text-sm font-bold text-gray-700">Filter Charts:</div>
                <select value={chartF.div} onChange={(e) => setChartF({...chartF, div: e.target.value})} className="px-4 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none font-semibold">
                  <option value="all">All Divisions</option>
                  {u.divs.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={chartF.team} onChange={(e) => setChartF({...chartF, team: e.target.value})} className="px-4 py-2 text-sm border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none font-semibold">
                  <option value="all">All Teams</option>
                  {u.teams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="ml-auto px-4 py-2 bg-white rounded-lg border-2 border-orange-200 text-sm font-bold text-orange-600">
                  📊 {chartFiltered.length} riders
                </div>
              </div>
            </div>

            <div className="p-4 overflow-y-auto bg-gray-50" style={{maxHeight: '75vh'}}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BarChart data={chartData.byCategory} title="🏁 Riders per Race Category" color="orange" />
                <BarChart data={chartData.byTeam} title="🏫 Top 15 Teams by Rider Count" color="orange" />
                <BarChart data={chartData.byGender} title="👥 Riders per Gender" color="blue" />
                <BarChart data={chartData.byGrade} title="🎓 Riders per Grade" color="green" />
                <BarChart data={chartData.avgLapCategory} title="⏱️ Avg Lap Time per Category (minutes)" color="purple" />
                <BarChart data={chartData.avgLapDivision} title="⏱️ Avg Lap Time per Division (minutes)" color="purple" />
                <BarChart data={chartData.avgLapTeam} title="⏱️ Avg Lap Time - Top 15 Fastest Teams (minutes)" color="purple" />
                <BarChart data={chartData.avgLapGrade} title="⏱️ Avg Lap Time per Grade (minutes)" color="purple" />
              </div>
            </div>
          </>
        )}

        <div className="p-3 bg-gradient-to-r from-orange-600 to-red-600 text-center text-xs text-white font-semibold">
          🚵 Utah HS Mountain Bike Racing • {DATA.length} total riders • {raceInfo.name}
        </div>
      </div>
    </div>
  );
}
