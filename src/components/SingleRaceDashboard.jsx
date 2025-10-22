import React, { useState, useMemo } from 'react';

// Sample data (50 riders) - Replace with full dataset in production
const SAMPLE_DATA = [
  {"NO":7361,"NAME":"HOUSTON LEWIS","Team":"Alta High School","Division":"D1","Team_PLC":1,"PLC":1,"CAT":"Freshman B Boys","GENDER":"M","GRD":9,"PTS":270,"LAP1":1265.0,"LAP2":1471.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"2736","TOTAL_TIME":2736.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1265.0,"pace":"21:05","delta":null},{"lap":2,"time":1471.0,"pace":"24:31","delta":"+206s"}]},
  {"NO":5208,"NAME":"SAM BROADBENT","Team":"Alta High School","Division":"D1","Team_PLC":2,"PLC":12,"CAT":"Freshman A Boys","GENDER":"M","GRD":9,"PTS":269,"LAP1":1242.0,"LAP2":1404.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"2646","TOTAL_TIME":2646.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1242.0,"pace":"20:42","delta":null},{"lap":2,"time":1404.0,"pace":"23:24","delta":"+162s"}]},
  {"NO":7375,"NAME":"THEO GOCHNOUR","Team":"Alta High School","Division":"D1","Team_PLC":3,"PLC":13,"CAT":"Freshman B Boys","GENDER":"M","GRD":9,"PTS":268,"LAP1":1369.0,"LAP2":1591.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"2960","TOTAL_TIME":2960.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1369.0,"pace":"22:49","delta":null},{"lap":2,"time":1591.0,"pace":"26:31","delta":"+222s"}]},
  {"NO":7366,"NAME":"COLLIN CURTIS","Team":"Alta High School","Division":"D1","Team_PLC":4,"PLC":26,"CAT":"Freshman B Boys","GENDER":"M","GRD":9,"PTS":255,"LAP1":1351.0,"LAP2":1667.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3018","TOTAL_TIME":3018.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1351.0,"pace":"22:31","delta":null},{"lap":2,"time":1667.0,"pace":"27:47","delta":"+316s"}]},
  {"NO":5206,"NAME":"HENRY MADSEN","Team":"Alta High School","Division":"D1","Team_PLC":5,"PLC":29,"CAT":"Freshman A Boys","GENDER":"M","GRD":9,"PTS":252,"LAP1":1268.0,"LAP2":1485.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"2753","TOTAL_TIME":2753.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1268.0,"pace":"21:08","delta":null},{"lap":2,"time":1485.0,"pace":"24:45","delta":"+217s"}]},
  {"NO":3828,"NAME":"AUBREY EWELL","Team":"Alta High School","Division":"D1","Team_PLC":6,"PLC":30,"CAT":"JV B Girls","GENDER":"F","GRD":10,"PTS":251,"LAP1":1481.0,"LAP2":1697.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3178","TOTAL_TIME":3178.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1481.0,"pace":"24:41","delta":null},{"lap":2,"time":1697.0,"pace":"28:17","delta":"+216s"}]},
  {"NO":7372,"NAME":"LUCAS POFF","Team":"Alta High School","Division":"D1","Team_PLC":7,"PLC":35,"CAT":"Freshman B Boys","GENDER":"M","GRD":9,"PTS":246,"LAP1":1362.0,"LAP2":1648.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3010","TOTAL_TIME":3010.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1362.0,"pace":"22:42","delta":null},{"lap":2,"time":1648.0,"pace":"27:28","delta":"+286s"}]},
  {"NO":5220,"NAME":"COLE NELSON","Team":"Alta High School","Division":"D1","Team_PLC":8,"PLC":39,"CAT":"Freshman A Boys","GENDER":"M","GRD":9,"PTS":242,"LAP1":1308.0,"LAP2":1507.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"2815","TOTAL_TIME":2815.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1308.0,"pace":"21:48","delta":null},{"lap":2,"time":1507.0,"pace":"25:07","delta":"+199s"}]},
  {"NO":7367,"NAME":"TALON TEWS","Team":"Alta High School","Division":"D1","Team_PLC":9,"PLC":49,"CAT":"Freshman B Boys","GENDER":"M","GRD":9,"PTS":232,"LAP1":1458.0,"LAP2":1670.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3128","TOTAL_TIME":3128.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1458.0,"pace":"24:18","delta":null},{"lap":2,"time":1670.0,"pace":"27:50","delta":"+212s"}]},
  {"NO":2801,"NAME":"JADEN BOWTHORPE","Team":"Alta High School","Division":"D1","Team_PLC":10,"PLC":58,"CAT":"JV B Boys","GENDER":"M","GRD":10,"PTS":223,"LAP1":1374.0,"LAP2":1545.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"2919","TOTAL_TIME":2919.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1374.0,"pace":"22:54","delta":null},{"lap":2,"time":1545.0,"pace":"25:45","delta":"+171s"}]},
  {"NO":7371,"NAME":"JACK HEAPS","Team":"Alta High School","Division":"D1","Team_PLC":11,"PLC":62,"CAT":"Freshman B Boys","GENDER":"M","GRD":9,"PTS":219,"LAP1":1508.0,"LAP2":1617.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3125","TOTAL_TIME":3125.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1508.0,"pace":"25:08","delta":null},{"lap":2,"time":1617.0,"pace":"26:57","delta":"+109s"}]},
  {"NO":7370,"NAME":"JUSTIN EWELL","Team":"Alta High School","Division":"D1","Team_PLC":12,"PLC":68,"CAT":"Freshman B Boys","GENDER":"M","GRD":9,"PTS":213,"LAP1":1481.0,"LAP2":1729.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3210","TOTAL_TIME":3210.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1481.0,"pace":"24:41","delta":null},{"lap":2,"time":1729.0,"pace":"28:49","delta":"+248s"}]},
  {"NO":3804,"NAME":"CAMILA JENSEN","Team":"Alta High School","Division":"D1","Team_PLC":13,"PLC":71,"CAT":"JV B Girls","GENDER":"F","GRD":11,"PTS":210,"LAP1":1632.0,"LAP2":1811.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3443","TOTAL_TIME":3443.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1632.0,"pace":"27:12","delta":null},{"lap":2,"time":1811.0,"pace":"30:11","delta":"+179s"}]},
  {"NO":7376,"NAME":"SAWYER PETERSEN","Team":"Alta High School","Division":"D1","Team_PLC":14,"PLC":77,"CAT":"Freshman B Boys","GENDER":"M","GRD":9,"PTS":204,"LAP1":1550.0,"LAP2":1702.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3252","TOTAL_TIME":3252.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1550.0,"pace":"25:50","delta":null},{"lap":2,"time":1702.0,"pace":"28:22","delta":"+152s"}]},
  {"NO":5221,"NAME":"BRECKEN SHULER","Team":"Alta High School","Division":"D1","Team_PLC":15,"PLC":85,"CAT":"Freshman A Boys","GENDER":"M","GRD":9,"PTS":196,"LAP1":1387.0,"LAP2":1555.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"2942","TOTAL_TIME":2942.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1387.0,"pace":"23:07","delta":null},{"lap":2,"time":1555.0,"pace":"25:55","delta":"+168s"}]},
  {"NO":7362,"NAME":"CADE PALMER","Team":"Alta High School","Division":"D1","Team_PLC":16,"PLC":87,"CAT":"Freshman B Boys","GENDER":"M","GRD":9,"PTS":194,"LAP1":1462.0,"LAP2":1823.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3285","TOTAL_TIME":3285.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1462.0,"pace":"24:22","delta":null},{"lap":2,"time":1823.0,"pace":"30:23","delta":"+361s"}]},
  {"NO":7380,"NAME":"EZRA HALL","Team":"Alta High School","Division":"D1","Team_PLC":17,"PLC":88,"CAT":"Freshman B Boys","GENDER":"M","GRD":9,"PTS":193,"LAP1":1574.0,"LAP2":1712.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3286","TOTAL_TIME":3286.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1574.0,"pace":"26:14","delta":null},{"lap":2,"time":1712.0,"pace":"28:32","delta":"+138s"}]},
  {"NO":2827,"NAME":"RORY WESTON","Team":"Alta High School","Division":"D1","Team_PLC":18,"PLC":99,"CAT":"JV B Boys","GENDER":"M","GRD":12,"PTS":182,"LAP1":1401.0,"LAP2":1608.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3009","TOTAL_TIME":3009.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1401.0,"pace":"23:21","delta":null},{"lap":2,"time":1608.0,"pace":"26:48","delta":"+207s"}]},
  {"NO":3828,"NAME":"AUDREY WORTLEY","Team":"Alta High School","Division":"D1","Team_PLC":19,"PLC":104,"CAT":"JV B Girls","GENDER":"F","GRD":9,"PTS":177,"LAP1":1717.0,"LAP2":1839.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3556","TOTAL_TIME":3556.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1717.0,"pace":"28:37","delta":null},{"lap":2,"time":1839.0,"pace":"30:39","delta":"+122s"}]},
  {"NO":2808,"NAME":"ETHAN HARRIS","Team":"Alta High School","Division":"D1","Team_PLC":20,"PLC":108,"CAT":"JV B Boys","GENDER":"M","GRD":11,"PTS":173,"LAP1":1442.0,"LAP2":1596.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3038","TOTAL_TIME":3038.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1442.0,"pace":"24:02","delta":null},{"lap":2,"time":1596.0,"pace":"26:36","delta":"+154s"}]},
  {"NO":3816,"NAME":"CALLIE FRAZIER","Team":"Alta High School","Division":"D1","Team_PLC":21,"PLC":109,"CAT":"JV B Girls","GENDER":"F","GRD":9,"PTS":172,"LAP1":1713.0,"LAP2":1922.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3635","TOTAL_TIME":3635.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1713.0,"pace":"28:33","delta":null},{"lap":2,"time":1922.0,"pace":"32:02","delta":"+209s"}]},
  {"NO":2821,"NAME":"OWEN REES","Team":"Alta High School","Division":"D1","Team_PLC":22,"PLC":111,"CAT":"JV B Boys","GENDER":"M","GRD":11,"PTS":170,"LAP1":1425.0,"LAP2":1635.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3060","TOTAL_TIME":3060.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1425.0,"pace":"23:45","delta":null},{"lap":2,"time":1635.0,"pace":"27:15","delta":"+210s"}]},
  {"NO":3812,"NAME":"EMMA MCBRIDE","Team":"Alta High School","Division":"D1","Team_PLC":23,"PLC":113,"CAT":"JV B Girls","GENDER":"F","GRD":10,"PTS":168,"LAP1":1691.0,"LAP2":1929.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3620","TOTAL_TIME":3620.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1691.0,"pace":"28:11","delta":null},{"lap":2,"time":1929.0,"pace":"32:09","delta":"+238s"}]},
  {"NO":2810,"NAME":"CALVIN BITTERS","Team":"Alta High School","Division":"D1","Team_PLC":24,"PLC":120,"CAT":"JV B Boys","GENDER":"M","GRD":10,"PTS":161,"LAP1":1472.0,"LAP2":1631.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3103","TOTAL_TIME":3103.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1472.0,"pace":"24:32","delta":null},{"lap":2,"time":1631.0,"pace":"27:11","delta":"+159s"}]},
  {"NO":5217,"NAME":"JOSUE CAMPOS JIMENEZ","Team":"Alta High School","Division":"D1","Team_PLC":25,"PLC":122,"CAT":"Freshman A Boys","GENDER":"M","GRD":9,"PTS":159,"LAP1":1480.0,"LAP2":1650.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3130","TOTAL_TIME":3130.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1480.0,"pace":"24:40","delta":null},{"lap":2,"time":1650.0,"pace":"27:30","delta":"+170s"}]},
  {"NO":7378,"NAME":"RYKER SMITH","Team":"Alta High School","Division":"D1","Team_PLC":26,"PLC":131,"CAT":"Freshman B Boys","GENDER":"M","GRD":9,"PTS":150,"LAP1":1649.0,"LAP2":1834.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3483","TOTAL_TIME":3483.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1649.0,"pace":"27:29","delta":null},{"lap":2,"time":1834.0,"pace":"30:34","delta":"+185s"}]},
  {"NO":7374,"NAME":"JONAH MCCLEARY","Team":"Alta High School","Division":"D1","Team_PLC":27,"PLC":133,"CAT":"Freshman B Boys","GENDER":"M","GRD":9,"PTS":148,"LAP1":1601.0,"LAP2":1882.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3483","TOTAL_TIME":3483.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1601.0,"pace":"26:41","delta":null},{"lap":2,"time":1882.0,"pace":"31:22","delta":"+281s"}]},
  {"NO":2819,"NAME":"BRIXTON HATCH","Team":"Alta High School","Division":"D1","Team_PLC":28,"PLC":143,"CAT":"JV B Boys","GENDER":"M","GRD":11,"PTS":138,"LAP1":1470.0,"LAP2":1688.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3158","TOTAL_TIME":3158.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1470.0,"pace":"24:30","delta":null},{"lap":2,"time":1688.0,"pace":"28:08","delta":"+218s"}]},
  {"NO":7365,"NAME":"EASTON COATES","Team":"Alta High School","Division":"D1","Team_PLC":29,"PLC":149,"CAT":"Freshman B Boys","GENDER":"M","GRD":9,"PTS":132,"LAP1":1633.0,"LAP2":1878.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3511","TOTAL_TIME":3511.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1633.0,"pace":"27:13","delta":null},{"lap":2,"time":1878.0,"pace":"31:18","delta":"+245s"}]},
  {"NO":3801,"NAME":"LUCY BIRD","Team":"Alta High School","Division":"D1","Team_PLC":30,"PLC":151,"CAT":"JV B Girls","GENDER":"F","GRD":11,"PTS":130,"LAP1":1835.0,"LAP2":2012.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3847","TOTAL_TIME":3847.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1835.0,"pace":"30:35","delta":null},{"lap":2,"time":2012.0,"pace":"33:32","delta":"+177s"}]},
  {"NO":3807,"NAME":"STELLA PERRY","Team":"Alta High School","Division":"D1","Team_PLC":31,"PLC":155,"CAT":"JV B Girls","GENDER":"F","GRD":9,"PTS":126,"LAP1":1777.0,"LAP2":2090.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3867","TOTAL_TIME":3867.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1777.0,"pace":"29:37","delta":null},{"lap":2,"time":2090.0,"pace":"34:50","delta":"+313s"}]},
  {"NO":7363,"NAME":"MERRICK BARBER","Team":"Alta High School","Division":"D1","Team_PLC":32,"PLC":158,"CAT":"Freshman B Boys","GENDER":"M","GRD":9,"PTS":123,"LAP1":1668.0,"LAP2":1913.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3581","TOTAL_TIME":3581.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1668.0,"pace":"27:48","delta":null},{"lap":2,"time":1913.0,"pace":"31:53","delta":"+245s"}]},
  {"NO":3805,"NAME":"CHLOE BAXTER","Team":"Alta High School","Division":"D1","Team_PLC":33,"PLC":164,"CAT":"JV B Girls","GENDER":"F","GRD":11,"PTS":117,"LAP1":1751.0,"LAP2":2083.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3834","TOTAL_TIME":3834.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1751.0,"pace":"29:11","delta":null},{"lap":2,"time":2083.0,"pace":"34:43","delta":"+332s"}]},
  {"NO":2811,"NAME":"PATRICK HARRIS","Team":"Alta High School","Division":"D1","Team_PLC":34,"PLC":167,"CAT":"JV B Boys","GENDER":"M","GRD":12,"PTS":114,"LAP1":1484.0,"LAP2":1708.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3192","TOTAL_TIME":3192.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1484.0,"pace":"24:44","delta":null},{"lap":2,"time":1708.0,"pace":"28:28","delta":"+224s"}]},
  {"NO":2806,"NAME":"HUNTER MAST","Team":"Alta High School","Division":"D1","Team_PLC":35,"PLC":168,"CAT":"JV B Boys","GENDER":"M","GRD":12,"PTS":113,"LAP1":1519.0,"LAP2":1676.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3195","TOTAL_TIME":3195.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1519.0,"pace":"25:19","delta":null},{"lap":2,"time":1676.0,"pace":"27:56","delta":"+157s"}]},
  {"NO":5201,"NAME":"WILL COIL","Team":"Alta High School","Division":"D1","Team_PLC":36,"PLC":172,"CAT":"Freshman A Boys","GENDER":"M","GRD":9,"PTS":109,"LAP1":1499.0,"LAP2":1715.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3214","TOTAL_TIME":3214.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1499.0,"pace":"24:59","delta":null},{"lap":2,"time":1715.0,"pace":"28:35","delta":"+216s"}]},
  {"NO":3826,"NAME":"ADRIANA AGUILAR SALDANA","Team":"Alta High School","Division":"D1","Team_PLC":37,"PLC":175,"CAT":"JV B Girls","GENDER":"F","GRD":11,"PTS":106,"LAP1":1799.0,"LAP2":2092.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3891","TOTAL_TIME":3891.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1799.0,"pace":"29:59","delta":null},{"lap":2,"time":2092.0,"pace":"34:52","delta":"+293s"}]},
  {"NO":2814,"NAME":"EVERETT PERRY","Team":"Alta High School","Division":"D1","Team_PLC":38,"PLC":184,"CAT":"JV B Boys","GENDER":"M","GRD":12,"PTS":97,"LAP1":1503.0,"LAP2":1729.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3232","TOTAL_TIME":3232.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1503.0,"pace":"25:03","delta":null},{"lap":2,"time":1729.0,"pace":"28:49","delta":"+226s"}]},
  {"NO":7377,"NAME":"GRIFFIN HEMENWAY","Team":"Alta High School","Division":"D1","Team_PLC":39,"PLC":185,"CAT":"Freshman B Boys","GENDER":"M","GRD":9,"PTS":96,"LAP1":1730.0,"LAP2":1906.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3636","TOTAL_TIME":3636.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1730.0,"pace":"28:50","delta":null},{"lap":2,"time":1906.0,"pace":"31:46","delta":"+176s"}]},
  {"NO":2818,"NAME":"GAVIN RASMUSSEN","Team":"Alta High School","Division":"D1","Team_PLC":40,"PLC":189,"CAT":"JV B Boys","GENDER":"M","GRD":10,"PTS":92,"LAP1":1513.0,"LAP2":1765.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3278","TOTAL_TIME":3278.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1513.0,"pace":"25:13","delta":null},{"lap":2,"time":1765.0,"pace":"29:25","delta":"+252s"}]},
  {"NO":7368,"NAME":"JOHN BINGHAM","Team":"Alta High School","Division":"D1","Team_PLC":41,"PLC":193,"CAT":"Freshman B Boys","GENDER":"M","GRD":9,"PTS":88,"LAP1":1698.0,"LAP2":1990.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3688","TOTAL_TIME":3688.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1698.0,"pace":"28:18","delta":null},{"lap":2,"time":1990.0,"pace":"33:10","delta":"+292s"}]},
  {"NO":7382,"NAME":"CARTER ZENGER","Team":"Alta High School","Division":"D1","Team_PLC":42,"PLC":196,"CAT":"Freshman B Boys","GENDER":"M","GRD":9,"PTS":85,"LAP1":1746.0,"LAP2":1989.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3735","TOTAL_TIME":3735.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1746.0,"pace":"29:06","delta":null},{"lap":2,"time":1989.0,"pace":"33:09","delta":"+243s"}]},
  {"NO":2822,"NAME":"DOMINIC SMITH","Team":"Alta High School","Division":"D1","Team_PLC":43,"PLC":197,"CAT":"JV B Boys","GENDER":"M","GRD":11,"PTS":84,"LAP1":1588.0,"LAP2":1758.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3346","TOTAL_TIME":3346.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1588.0,"pace":"26:28","delta":null},{"lap":2,"time":1758.0,"pace":"29:18","delta":"+170s"}]},
  {"NO":3825,"NAME":"MARLEY WESTON","Team":"Alta High School","Division":"D1","Team_PLC":44,"PLC":198,"CAT":"JV B Girls","GENDER":"F","GRD":11,"PTS":83,"LAP1":1784.0,"LAP2":2082.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3866","TOTAL_TIME":3866.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1784.0,"pace":"29:44","delta":null},{"lap":2,"time":2082.0,"pace":"34:42","delta":"+298s"}]},
  {"NO":3818,"NAME":"ADDISON CURTIS","Team":"Alta High School","Division":"D1","Team_PLC":45,"PLC":200,"CAT":"JV B Girls","GENDER":"F","GRD":9,"PTS":81,"LAP1":1873.0,"LAP2":2033.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3906","TOTAL_TIME":3906.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1873.0,"pace":"31:13","delta":null},{"lap":2,"time":2033.0,"pace":"33:53","delta":"+160s"}]},
  {"NO":3827,"NAME":"LEVI WATKINS","Team":"Alta High School","Division":"D1","Team_PLC":46,"PLC":201,"CAT":"JV B Girls","GENDER":"M","GRD":10,"PTS":81,"LAP1":1833.0,"LAP2":2118.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3951","TOTAL_TIME":3951.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1833.0,"pace":"30:33","delta":null},{"lap":2,"time":2118.0,"pace":"35:18","delta":"+285s"}]},
  {"NO":2815,"NAME":"JUDE THOMAS","Team":"Alta High School","Division":"D1","Team_PLC":47,"PLC":203,"CAT":"JV B Boys","GENDER":"M","GRD":11,"PTS":81,"LAP1":1571.0,"LAP2":1791.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3362","TOTAL_TIME":3362.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1571.0,"pace":"26:11","delta":null},{"lap":2,"time":1791.0,"pace":"29:51","delta":"+220s"}]},
  {"NO":7364,"NAME":"LUCA FREI","Team":"Alta High School","Division":"D1","Team_PLC":48,"PLC":204,"CAT":"Freshman B Boys","GENDER":"M","GRD":9,"PTS":81,"LAP1":1714.0,"LAP2":2014.0,"LAP3":null,"LAP4":null,"PEN":0,"TIME":"3728","TOTAL_TIME":3728.0,"NUM_LAPS":2,"School_Elevation":4505,"laps":[{"lap":1,"time":1714.0,"pace":"28:34","delta":null},{"lap":2,"time":2014.0,"pace":"33:34","delta":"+300s"}]}
];

export default function SingleRaceDashboard({ raceData, raceInfo }) {
  const [activeTab, setActiveTab] = useState('charts');
  const [f, setF] = useState({div: 'all', cat: 'all', gen: 'all', team: 'all', search: ''});
  const [chartF, setChartF] = useState({div: 'all', team: 'all', gen: 'all', cat: 'all'});
  const [s, setS] = useState({k: 'PLC', d: 'asc'});

  const DATA = raceData || SAMPLE_DATA;

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
                <BarChart data={chartData.byTeam} title="🏫 Team Racer Count (Top 10)" color="orange" />
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
