function f3(){

      ///////////////////
      var tabulate3 = function (data,columns) {
          var table = d3version3.select('#myTable3')
          var thead = table.append('thead')
          var tbody = table.append('tbody')

            thead.append('tr')
              .selectAll('th')
                .data(columns)
                .enter()
              .append('th')
                .text(function (d) { return d })

            var rows = tbody.selectAll('tr')
                .data(data)
                .enter()
              .append('tr').attr('class', function (d) {
                //console.log(d)
                // Objetivo:
                // "Numero" de Objetivo PND. Es "1.1.1" de "1.1.1 Garantizar a toda la población el derecho universal a la identidad."
                // Meta:
                // "Numero" de Meta Meta ODS. Es "16.9" de "16.9 De aquí a 2030, proporcionar acceso a una identidad jurídica para todos, en particular mediante el registro de nacimientos."
                return d.PND_subgrupo +" "+d.ODS_subgrupo
               }) //AQUI
                 .each(function (d) {
                    d3version3.select(this).style("visibility", "collapse");
                    //d3version3.select(this).style("visibility", "visible");
                });


            var cells = rows.selectAll('td')
                .data(function(row, row_index) {
                    return columns.map(function (column, column_index) {
                      //console.log("row["+column+"("+row_index+"-"+column_index+")]: "+row[column])
                        return { column: column, value: row[column] }
                  })
              })
              .enter()
            .append('td')
              .text(function (d) { return d.value })

          return table;
        }
        //d3version3.csv("data/data.csv", function(error, data) {
        //d3version3.csv("data/data3.csv", function(error, data) {
        d3version3.csv("data/my_input3.csv", function(error, data) {
          //const columns = ["VALOR",'Eje','Objetivo Estratégico','Objetivo PND','Indicadores']
          //const columns = ['Eje','Objetivo Estratégico','Objetivo PND','Indicadores']
          //const columns = ["Objetivo","Meta ODS", "Objetivo Estratégico","Vinculación","Problemática ODS","Acción ODS","Sujeto ODS"]
          //const columns = ["Meta ODS", "Objetivo Estratégico","Vinculación","Problemática ODS","Acción ODS","Sujeto ODS"]
          const columns = ["Meta ODS","Objetivo PND", //"PND_grupo",
        "Vinculación",
        //"Problemática ODS",	"Acción ODS",	"Sujeto ODS"
        //Objetivo Estratégico	Objetivo PND	ODS	Meta ODS	PND_subgrupo	PND_grupo	ODS_grupo	ODS_subgrupo
      ]
          //Eje_n	Eje	Objetivo Estratégico	Objetivo PND	Sujeto PND 	Problemática PND	Acción PND	ODS	Meta	Meta ODS	Sujeto ODS	Problemática ODS	Acción ODS	Vinculación

          tabulate3(data,columns)
        });
    ////

    /*
    Basado en
      https://jsfiddle.net/Twisty/192m0uyc/2/
    */
      var count_aux = 10;

var w = 740,
    h = 700,
    rx = w / 2,
    ry = h / 2,
    m0,
    rotate = 0
    pi = Math.PI;

var splines = [];

var cluster = d3version3.layout.cluster()
    .size([360, ry - 180])
    // http://bl.ocks.org/mayblue9/dcc49ef6e3888f37f755177c4a248f2c ORDENAR
    .sort(function(a, b) { //console.log(a.key +" - "+ b.key);
    return d3version3.ascending(a.key, b.key);
  });

var bundle = d3version3.layout.bundle();

var line = d3version3.svg.line.radial()
    .interpolate("bundle")
    .tension(.85)
    .radius(function(d) { return d.y; })
    .angle(function(d) { return d.x / 180 * Math.PI; });

var div = d3version3.select("#bundle")
    .style("width", w + "px")
    .style("height", w + "px")
    .style("position", "absolute");

var svg = div.append("svg:svg")
    .attr("width", w)
    .attr("height", w)
  .append("svg:g")
    .attr("transform", "translate(" + rx + "," + ry + ")");

svg.append("svg:path")
    .attr("class", "arc")
    .attr("d", d3version3.svg.arc().outerRadius(ry - 180).innerRadius(0).startAngle(0).endAngle(2 * Math.PI))
    .on("mousedown", mousedown);

//d3version3.json("flare-imports.json", function(classes) {
//d3version3.json("data/mini.json", function(classes) {
d3version3.json("data/mini.json", function(classes) {

    var nodes = cluster.nodes(packages.root(classes)),
        //links = packages.imports(nodes), // NOMBRE de las conexiones imports(nodes),
        links = packages.imports(nodes),
        splines = bundle(links);

    var path = svg.selectAll("path.link")
        .data(links)
      .enter().append("svg:path")
        .attr("class", function(d) {
          //console.log("[79]")
            //console.log(d)
          //return "link source-" + d.source.key + " target-" + d.target.key + " relation_"+d.relation;
        //return "link source-" + d.source.key + " target-" + d.target.key ;
        return "link source-" + d.source.key + " target-" + d.target.key + " relation_"+d.relation;
        })
        .attr("d", function(d, i) { return line(splines[i]); });

    var groupData = svg.selectAll("g.group")
      .data(nodes.filter(function(d) {
          //return (d.key=='ODS_16_9' || d.key == 'ODS_3' || d.key == 'ODS_4' || d.key == 'ODS_16'
          //|| d.key == 'PND_1_1') && d.children;

          var root_list = [];
          for (var i = 1; i <= 17; i++) {
              root_list.push("ODS_"+i);
          }
          for (var i = 1; i <= 4; i++) {
            for (var j = 1; j <= 4; j++) {
                root_list.push("PND_"+i+"_"+j);
            }
          }
          return root_list.includes(d.key) && d.children;
      }))
    .enter().append("group")
      .attr("class", "group");

    var groupArc = d3version3.svg.arc()
    .innerRadius(ry - 177)
    .outerRadius(ry - 157)
  	//.padAngle(.02)
    .startAngle(function(d) { return (findStartAngle(d.__data__.children) - 2) * pi / 180;})
    .endAngle(function(d) { return (findEndAngle(d.__data__.children) + 2) * pi / 180});

    var nODS = 17;
    var nPND = 4*4;
    /*
    var colorScaleArc = d3version3.scale.quantize()
      //.domain([0,3])
      .domain([0,6])
      .range(["#FF0000", // Grupo 0 (fill: rgb(255, 0, 0); fill-opacity: 0.5;)
        "#00FF00", // ARISTA
        "#0000FF", // Grupo 1 (fill: rgb(0, 0, 255); fill-opacity: 0.5;)
        "#008888", //
        "#FF8888", // Grupo 2 (fill: rgb(255, 136, 136); fill-opacity: 0.5;)
        "#0088FF", // Grupo 3 (fill: rgb(255, 136, 255); fill-opacity: 0.5;)
        "#FF88FF" //
      ]);*/


                    var colorScaleArc = function(d) {
                      //ODS_16
                      color_hash = {
                        "ODS_1":"123858",
                        "ODS_2":"DC022F",
                        "ODS_3":"D4972D",
                        "ODS_4":"3F9336",
                        "ODS_5":"B80B24",
                        "ODS_6":"E72823",
                        "ODS_7":"26B2E0",
                        "ODS_8":"F9B912",
                        "ODS_9":"900B35",
                        "ODS_10":"EC5324",
                        "ODS_11":"d3version30055",
                        "ODS_12":"F48B21",
                        "ODS_13":"B07B22",
                        "ODS_14":"336E36",
                        "ODS_15":"1D83CA",
                        "ODS_16":"4BB037",
                        "ODS_17":"13558D",

                        "PND_1_1":"F2B729",
                        "PND_1_2":"F1B629",
                        "PND_1_3":"F2B628",
                        "PND_1_4":"F2B729",

                        "PND_2_1":"F1B728",
                        "PND_2_2":"1A3F7A",
                        "PND_2_3":"1A3F79",
                        "PND_2_4":"50872F",

                        "PND_3_1":"F2B729",
                        "PND_3_2":"1A3F79",
                        "PND_3_3":"1A3F79",
                        "PND_3_4":"508730",

                        "PND_4_1":"F1B628",
                        "PND_4_2":"E65631",
                        "PND_4_3":"E55530",
                        "PND_4_4":"508730",
                      }

                      // ODS COLORS
                      //"123858","DC022F", "D4972D", "3F9336", "B80B24", "E72823", "26B2E0", "F9B912", "900B35", "EC5324", "d3version30055",
                      //"F48B21", "B07B22", "336E36", "1D83CA", "4BB037", "13558D",
                      // PND COLORS
                      //"F2B729","F1B629", "F2B628", "F2B729",
                      //"F1B728", "1A3F7A", "1A3F79", "50872F",
                      //"F2B729", "1A3F79", "1A3F79", "508730",
                      //"F1B628", "E65631", "E55530", "508730"
                      //console.log("---"+i)
                      c = color_hash[d]
                      //console.log(c)

                      if(c)
                      {return c}
                      return "00FF00"
                    }

    svg.selectAll("g.arc")
    .data(groupData[0])
  .enter().append("svg:path")
    .attr("d", groupArc)
    .attr("class", "groupArc")
    //.style("fill", "#1f77b4")
    //.style("fill-opacity", 0.5);
    .call(text => text.append("title").text( (d,i) =>
      {
        N = d.__data__.children.length;
        msg = `${d.__data__.name} :
        Se compone de ${N} elemento`
        if(N>1)
          {msg+="s"}
        return  msg;
      }
    ))
    .style("fill", function(d, i) {
      //console.log(i+": "+d.__data__.name);
      return colorScaleArc(d.__data__.name);
    }) // ARCOS ROJOS
    .style("fill-opacity", 0.5);

    svg.selectAll("g.node")
        .data(nodes.filter(function(n) { return !n.children; }))
      .enter().append("svg:g")
        .attr("class", "node")
        .attr("id", function(d) { return "node-" + d.key; })
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
      .append("svg:text")
        .attr("dx", function(d) { return d.x < 180 ? 25 : -25; })
        .attr("dy", ".31em")
        .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
        .attr("transform", function(d) { return d.x < 180 ? null : "rotate(180)"; })
        .text(function(d) { return d.key.replace(/_/g, ' '); })
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("click", clickfunction)
        .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");});
});

d3version3.select(window)
    .on("mousemove", mousemove)
    .on("mouseup", mouseup);

function mouse(e) {
  return [e.pageX - rx, e.pageY - ry];
}
function clickfunction (e){
  //console.log(e.key);
  //console.log(e);


  // FILTRAR ROWS para == ekey

                      var table = d3version3.select('#myTable3')
                      var tbody = table.select('tbody');
                        var rows = tbody.selectAll('tr')
                        .each(function (d) {
                           d3version3.select(this).style("visibility", function() {
                               return (true) ? "visible" : "hidden";
                           });
                       });
                       //tbody.selectAll('tr').selectAll(".FILA_1").style("visibility", function() {return true });
                         var rows = tbody.selectAll('tr')
                         .each(function (r) {
                            d3version3.select(this).style("visibility", function() {
                                //console.log(r) // AQUI AQUI
                                return (r.ODS_subgrupo == e.key || r.PND_subgrupo == e.key) ? "table-cell" : "collapse";
                                //return (r.VALOR%2==0) ? "table-cell" : "collapse";
                            });
                        });
/************************************************************************************************************

AGREGAR ID AL EVENTO
 {name: "root.Jobs.Bayard", relation: "Total", imports: Array(3), parent: {…}, key: "Bayard", …}
FILTRAR CLASS == ID
*************************************************************************************************************/

}
function mousedown() {
  m0 = mouse(d3version3.event);
  d3version3.event.preventDefault();
}

function mousemove() {
  if (m0) {
    var m1 = mouse(d3version3.event),
        dm = Math.atan2(cross(m0, m1), dot(m0, m1)) * 180 / Math.PI;
    div.style("-webkit-transform", "translate3d(0," + (ry - rx) + "px,0)rotate3d(0,0,0," + dm + "deg)translate3d(0," + (rx - ry) + "px,0)");
  }
}

function mouseup() {
    if (m0) {
        var m1 = mouse(d3version3.event),
            dm = Math.atan2(cross(m0, m1), dot(m0, m1)) * 180 / Math.PI;

        rotate += dm;
        if (rotate > 360) rotate -= 360;
        else if (rotate < 0) rotate += 360;
        m0 = null;

        div.style("-webkit-transform", "rotate3d(0,0,0,0deg)");

        svg.attr("transform", "translate(" + rx + "," + ry + ")rotate(" + rotate + ")")
          .selectAll("g.node text")
            .attr("dx", function(d) { return (d.x + rotate) % 360 < 180 ? 25 : -25; })
            .attr("text-anchor", function(d) { return (d.x + rotate) % 360 < 180 ? "start" : "end"; })
            .attr("transform", function(d) { return (d.x + rotate) % 360 < 180 ? null : "rotate(180)"; });
    }
}

var tooltip = d3version3.select("body")
	.append("div")
  .attr("class", "tooltip")
	.style("position", "absolute")
	.style("z-index", "10")
	.style("visibility", "hidden");//.text("Tooltip");
  //.html('<h1>ALGO</h1>'+'Otro<br />asd');

function mouseover(d) {
  //console.log(d)
  //link source-ODS_16.9 target-PND_1.1.1 relation_Parcial
    svg.selectAll("path.link.target-" + d.key)
        .classed("target", true)
        .each(updateNodes("source", true));

    svg.selectAll("path.link.source-" + d.key)
        .classed("source", true)
        .each(updateNodes("target", true));

        // SECCION TOOLTIP

      var msg = "<ul>";
      var node = (svg.selectAll("path.link.source-" + d.key)).filter(function(d2){
          msa = d3version3.select(this).attr('class');
          msa.split(" ").forEach(function(a) {
            class_name = "target-";
            if(a != "link" && (a.includes(class_name)))
            {msg += "<li>"+a.substring(class_name.length) +"</li>";}
          }); // forEach
        }); // filter

      var node = (svg.selectAll("path.link.target-" + d.key)).filter(function(d2){
          msa = d3version3.select(this).attr('class');
          msa.split(" ").forEach(function(a) {
            class_name = "source-";
            if(a != "link" && (a.includes(class_name)))
              {msg += "<li>"+a.substring(class_name.length) +"</li>";}
          });// forEach
        });//filter

        N = (svg.selectAll("path.link.target-" + d.key)).size() + (svg.selectAll("path.link.source-" + d.key)).size();
        if(N==1){
          tooltip.html( d.key+' tiene <b>'+1+'</b> conexión'+ msg+"</li>");
        }else{
          tooltip.html( d.key+' tiene <b>'+N+'</b> conexiones'+ msg+"</li>" );
        }
        return tooltip.style("visibility", "visible");

}

function mouseout(d) {
    svg.selectAll("path.link.source-" + d.key)
        .classed("source", false)
        .each(updateNodes("target", false));

    svg.selectAll("path.link.target-" + d.key)
        .classed("target", false)
        .each(updateNodes("source", false));
    return tooltip.style("visibility", "hidden");
}

function updateNodes(name, value) {
  return function(d) {
    if (value) this.parentNode.appendChild(this);
    svg.select("#node-" + d[name].key).classed(name, value);
  };
}

function cross(a, b) {
  return a[0] * b[1] - a[1] * b[0];
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}

function findStartAngle(children) {
    var min = children[0].x;
    children.forEach(function(d) {
       if (d.x < min)
           min = d.x;
    });
    return min;
}

function findEndAngle(children) {
    var max = children[0].x;
    children.forEach(function(d) {
       if (d.x > max)
           max = d.x;
    });
    return max;
}
///////////////////
}
f3()
