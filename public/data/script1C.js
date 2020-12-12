function f1(){
    //d3version4.csv("data/data2.csv", function(error, data) {
    d3version4.csv("data/my_input.csv", function(error, data) {

        var select = d3version4.select("#id_select")
          .append("div")
          .append("select").
          attr("class", "btn btn-danger").
          attr("id", "queryDays")

        select
          .on("change", function(d) {
            var v = d3version4.select(this).property("value");
            console.log(v)
            moveStackToFront(v);
            function moveStackToFront(elD) {
                console.log("SI2: " + elD);
                svg.selectAll('.slice').filter(d => d.data.id == elD)
                //svg.selectAll('.slice').filter(d => d.value == elD)
                    .each(function(d) {
                        //console.log("SI")
                        focusOn(d)
                        paint(d)
                    })}
          });
          var expensesByName = d3version4.nest()
            .key(function(d) { return d.ODS_grupo; })
              .key(function(d) { return d.ODS_subgrupo; })
            .entries(data);
            //console.log(expensesByName)
            /*
            expensesByName.forEach((item, i) => {
              console.log(i+":")
              console.log(item)

              item.values.forEach((item2, i2) => {
                console.log(i2+":")
                console.log(item2)

              });
            });*/




            select
  .selectAll('optgroup')
    .data(expensesByName)
    .enter()
  .append('optgroup')
    .attr('value',function (d) { return d.key })
    .attr('label',function (d) { return d.key})
  .selectAll('option')
    .data(function (d) { return d.values })
    //.data(d3version4.map(expensesByName, function(d){return d.values;}).keys())

    .enter()
  .append('option')
    .attr('value',function (d) { return d.key })
    //.text(function (d) { return d })
  .text(function (d) {

    max_string = 80 //18 // CARACTERES DE CADA OPTION DEL SELECT (LARGO)
    val = d.values[0]["Meta ODS"]
       if(val.length > max_string)
           return val.substring(0,max_string)+'...';
       else
           return val;

           //console.log(d)
           return val;
   });

   select.insert("option",":first-child").
   attr('selected', 'selected').
   attr('value', 0). // REVISAR valor default
   text('Filtrar')

  }); // d3version4.csv("data.csv", function(error, data) {

  ///////////////////
  var tabulate = function (data,columns) {
      var table = d3version4.select('#myTable')
      var thead = table.append('thead')
      var tbody = table.append('tbody')

        thead.append('tr')
          .selectAll('th')
            .data(columns)
            .enter()
          .append('th')
            .text(function (d,i) {
              //console.log(["113"]+i)
              if(i==3)
              {return "Objetivo Estratégico"}

              return d
            })

        var rows = tbody.selectAll('tr')
            .data(data)
            .enter()
          .append('tr').attr('class', function (d) {
            //console.log("267");
              //console.log(d);
             //return "FILA_"+d.VALOR +" "+d.Grupo
            return d.ODS_grupo +" "+d.ODS_subgrupo
           }) //AQUI
             .each(function (d) {
                d3version4.select(this).style("visibility", "collapse");
            });


        var cells = rows.selectAll('td')
            .data(function(row, row_index) {
                return columns.map(function (column, column_index) {
                  //console.log("row["+column+"("+row_index+"-"+column_index+")]: "+row[column])
                    return { column: column, value: row[column] }
              })
          })
          .enter()
        .append('td')/*
          .text(function (d) {
            //https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/01/S_SDG_Icons-01-12.jpg
            return d.value
          })*/
            //.text(function (d, i) {if (i != 1 && i != 2) return d.value })
            //.text(function (d, i) {if (i >0) return d.value })
            .text(function (d, i) {if (i != 0 && i != 3) return d.value })
  	.each(function(d, i) {
  		if (i == 0) {
      	var imgData = [];
        //console.log(d.value)
        imgData.push(d.value);
        //the_image = "https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/01/S_SDG_Icons-01-"
        //if(d.value<10){the_image+="0"}
        the_image="img/ods"+d.value;

        d3version4.select(this).selectAll("img")
  				.data(imgData)
          .enter()
          .append("img") // doesn't append an <img> anywhere
          //.attr("src", d.value)
          .attr("src", the_image+".jpg")
          .attr("height", "110px")
          .attr("width", "110px");
      }
      else
      if(i == 3){

        // https://www.stp.gov.py/v1/pnd-en-construccion/
        	var imgData = [];
          //console.log(d)
          //console.log(d[i])
          //console.log(i)
//          console.log("---")
          imgData.push(d.value);
          //the_image = "https://www.un.org/sustainabledevelopment/es/wp-content/uploads/sites/3/2016/01/S_SDG_Icons-01-"
          //if(d.value<10){the_image+="0"}
          the_image="img/"+d.value;
          //the_image="img/pnd1.1";

          d3version4.select(this).selectAll("img")
    				.data(imgData)
            .enter()
            .append("img") // doesn't append an <img> anywhere
            //.attr("src", d.value)
            .attr("src", the_image+".png")
            .attr("height", "110px")
            .attr("width", "110px");

      }
  	})

        return table;

      return table;
    }
    //d3version4.csv("data/data2.csv", function(error, data) {
    d3version4.csv("data/my_input1.csv", function(error, data) {
      //const columns = ["VALOR",'Eje','Objetivo Estratégico','Objetivo PND','Indicadores']
      //const columns = ['Eje','Objetivo Estratégico','Objetivo PND','Indicadores']
      //const columns = ["Objetivo Estratégico","Objetivo PND","ODS","Meta ODS"]
      //const columns = ["ODS","Meta ODS","Objetivo Estratégico","Objetivo PND", "PND_grupo"]
      const columns = ["ODS","Meta ODS","Objetivo PND", "PND_grupo"]
      tabulate(data,columns)
    });
////
/************************************************************************************/

        const width = window.innerWidth,
            height = window.innerHeight,
            maxRadius = (Math.min(width, height) / 2) - 5;

        const formatNumber = d3version4.format(',d');

        const x = d3version4.scaleLinear()
            .range([0, 2 * Math.PI])
            .clamp(true);

        const y = d3version4.scaleSqrt()
            .range([maxRadius*.1, maxRadius]);

        const color1 = d3version4.scaleOrdinal(d3version4.schemeCategory20);


        const partition = d3version4.partition();

        const arc = d3version4.arc()
            .startAngle(d => x(d.x0))
            .endAngle(d => x(d.x1))
            .innerRadius(d => Math.max(0, y(d.y0)))
            .outerRadius(d => Math.max(0, y(d.y1)));

        const middleArcLine = d => {
            const halfPi = Math.PI/2;
            const angles = [x(d.x0) - halfPi, x(d.x1) - halfPi];
            const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);

            const middleAngle = (angles[1] + angles[0]) / 2;
            const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
            if (invertDirection) { angles.reverse(); }

            const path = d3version4.path();
            path.arc(0, 0, r, angles[0], angles[1], invertDirection);
            return path.toString();
        };

        const textFits = d => {
            const CHAR_SPACE = 6;

            const deltaAngle = x(d.x1) - x(d.x0);
            const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
            const perimeter = r * deltaAngle;

            return d.data.name.length * CHAR_SPACE < perimeter;
        };

        const svg = d3version4.select('#partitionSVG1').append('svg')
                .style('width', '100vw')
                .style('height', '100vh')
            .attr('viewBox', `${-width / 3} ${-height / 3} ${2/3*width} ${2/3*height}`)
            .on('click', () => focusOn()); // Reset zoom on canvas click

        d3version4.json('data/my_input1.json', (error, root) => {
            if (error) throw error;

            root = d3version4.hierarchy(root);
          	console.log(root)
            //root.sum(d => d.value);
            root.sum(d => d.value);
            //root.sum(d => d.id);

            const slice = svg.selectAll('g.slice')
                .data(partition(root).descendants());

            slice.exit().remove();

            const newSlice = slice.enter()
                .append('g').attr('class', 'slice')
                .on('click', d => {
                    d3version4.event.stopPropagation();
                    //if(d.value != d3version4.select("#queryDays").value){
                    if(d.data.id != d3version4.select("#queryDays").value){
                      console.log(d)
                      console.log("[376] "+d.data.id +" - "+d.value +" - "+ d3version4.select("#queryDays").node().value)
                      d3version4.select("#queryDays").node().value = d.data.id
                      console.log(d3version4.select("#queryDays").node().value)
                      // PENDIENTE: AGREGAR GROUP
                      //if(!d3version4.select("#queryDays").node().value)
                      //{d3version4.select("#queryDays").node().value = d.data.id}

                      if(!d3version4.select("#queryDays").node().value)
                      {d3version4.select("#queryDays").node().value = 0}
                      paint(d)
                    }
                    focusOn(d);
                });

            //newSlice.append('title').text(d => d.data.name + '\n' + formatNumber(d.value));
            newSlice.append('title')
                .text(d => d.data.name );

                // Option 1: provide color names:
                var myColor = d3version4.scaleOrdinal().domain(d3version4.range(17))
                  .range([
                  "123858","DC022F", "D4972D", "3F9336", "B80B24", "E72823", "26B2E0", "F9B912", "900B35", "EC5324", "d3version40055",
                  "F48B21", "B07B22", "336E36", "1D83CA", "4BB037", "13558D",
                  "FFFFFF"
                ])

                //svg.selectAll(".firstrow").data(data).enter().append("circle").attr("cx", function(d,i){return 30 + i*60}).attr("cy", 50).attr("r", 19).attr("fill", function(d){return myColor(d) })

                newSlice.append('path')
                    .attr('class', 'main-arc')
                    .style('fill', function(d){
                      //console.log(d.data.name.indexOf("."))
                      val = d.data.ods_class
                      //console.log(val)
                      return myColor(val) })
                    //color1((d.children ? d : d.parent).data.name))
                    .attr('d', arc);

/*
            newSlice.append('path')
                .attr('class', 'main-arc')
                .style('fill', d =>
                color1((d.children ? d : d.parent).data.name))
                .attr('d', arc);
                */

            newSlice.append('path')
                .attr('class', 'hidden-arc')
                .attr('id', (_, i) => `hiddenArc${i}`)
                .attr('d', middleArcLine);

            const text = newSlice.append('text')
                .attr('display', d => textFits(d) ? null : 'none');

            // Add white contour
            text.append('textPath')
                .attr('startOffset','50%')
                .attr('xlink:href', (_, i) => `#hiddenArc${i}` )
                .text(d => d.data.name)
                .style('fill', 'none')
                .style('stroke', '#fff')
                .style('stroke-width', 5)
                .style('stroke-linejoin', 'round');

            text.append('textPath')
                .attr('startOffset','50%')
                .attr('xlink:href', (_, i) => `#hiddenArc${i}` )
                .text(d => d.data.name);
        });

                function paint(d){
                  //console.log("421")
                    //console.log(d)

                  const tds = d3version4.selectAll("td")
                    .each(function(x, y) {
                      d3version4.select(this).style("background-color", this.innerHTML == d.data.id ? "yellow" : null)
                    })

                    var table = d3version4.select('#myTable')
                    var tbody = table.select('tbody');
                      var rows = tbody.selectAll('tr')
                      .each(function (d) {
                         d3version4.select(this).style("visibility", function() {
                             return (true) ? "visible" : "hidden";
                         });
                     });
                     //tbody.selectAll('tr').selectAll(".FILA_1").style("visibility", function() {return true });
                       var rows = tbody.selectAll('tr')
                       .each(function (r) {
                          d3version4.select(this).style("visibility", function() {
                              //console.log(r) // AQUI AQUI
                              return (r.ODS_subgrupo == d.data.id || r.ODS_grupo == d.data.id) ? "table-cell" : "collapse";
                              //return (r.VALOR%2==0) ? "table-cell" : "collapse";
                          });
                      });

                }
        function focusOn(d = { x0: 0, x1: 1, y0: 0, y1: 1 }) {
            // Reset to top-level if no data point specified

            const transition = svg.transition()
                .duration(750)
                .tween('scale', () => {
                    const xd = d3version4.interpolate(x.domain(), [d.x0, d.x1]),
                        yd = d3version4.interpolate(y.domain(), [d.y0, 1]);
                    return t => { x.domain(xd(t)); y.domain(yd(t)); };
                });

            transition.selectAll('path.main-arc')
                .attrTween('d', d => () => arc(d));

            transition.selectAll('path.hidden-arc')
                .attrTween('d', d => () => middleArcLine(d));

            transition.selectAll('text')
                .attrTween('display', d => () => textFits(d) ? null : 'none');
        }

            d3version4.select("#queryDays").on("change", function() {
              var v = this.value;
              console.log(v)
              moveStackToFront(v);
                          function moveStackToFront(elD) {
                              console.log("SI2: " + elD)
                              //svg.selectAll('.slice').filter(d => d.value == elD)
                              svg.selectAll('.slice').filter(d => d.id == elD)
                                  .each(function(d) {
                                      console.log("SI")
                                      focusOn(d)
                                      paint(d)
                                  })
                          }
            })
}
f1();
