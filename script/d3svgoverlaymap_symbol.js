// ------------------------------------------------
//------------CE QU'IL RESTE À FAIRE : 
//  [x] Créer une légende sur les quantiles
//  [ ] Déterminer si l'encodage pour le code couleur se fait dans D3.js ou en amont dans R
//      --> l'encodage se fait sur un car cela donne plus de libertés quant au Scale percentize intégré dans D3.js
//  [x] Encodage avec Scale.Threshold correspondant aux quantiles des données (09.03.2022)
//  [x] Encodage de la légende avec les quantiles
//  [x] How to Improve D3.js Graphs with Annotations
//  [ ] Eviter la superposition des points de données, quand les coordonées GPS sont identiques force_pack.js
//  [ ] Feature de la bordure des cercles trait-tillés force_pack.js
//  [x] Modifier les légendes avec les nouvelles données ESG
//  [ ]
//  [ ]


function map_symbol() {

   
 var map = L.map("mapdiv", {
    center: [46.50, 7.95],
    zoom: 4.1
  });
  map.setMaxBounds([
    [34.91, -9.31],
    [69.66, 48.44]
  ]);
  map.setMinZoom(3.7);

  
  
    // Définir les différentes couches de base:
    var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    });
    var osmNoirBlanc = L.tileLayer(
      'http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
      }
    );
    var esriImagery = L.tileLayer(
      'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; <a href="http://www.esri.com">Esri</a>, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }
    );
    var myMapbox = L.tileLayer(
      'https://api.mapbox.com/styles/v1/mathiaslauber/ck2kaig6q0bp71ctivdduc3aw/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWF0aGlhc2xhdWJlciIsImEiOiJjazJrYWhkb3IwZHFhM21xcGxrdG80a2s3In0.WOEWDNFeMHLJpOq-KdC6ew', {
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
      }
    );
    var myMapbox2 = L.tileLayer(
      'https://api.mapbox.com/styles/v1/mathiaslauber/ckgt7ofrp1why19n8boge39u7/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWF0aGlhc2xhdWJlciIsImEiOiJjazJrYWhkb3IwZHFhM21xcGxrdG80a2s3In0.WOEWDNFeMHLJpOq-KdC6ew', {
        attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
      }
    );
    // Ajouter la couche de base par défaut à la carte.
    //api.mapbox.com/styles/v1/mathiaslauber/ckgt7ofrp1why19n8boge39u7.html?fresh=true&title=copy&access_token=pk.eyJ1IjoibWF0aGlhc2xhdWJlciIsImEiOiJjazJrYWhkb3IwZHFhM21xcGxrdG80a2s3In0.WOEWDNFeMHLJpOq-KdC6ew
    myMapbox2.addTo(map);
  
  
    // Créer les boutons pour changer la couche de base
    var baseLayers = {
      "Carte": myMapbox2,
      "Photos aériennes": esriImagery,
      "Filigrane vert": myMapbox,
      "Openstreetmap": osmLayer,
      "OpenStreetmap,noirblanc": osmNoirBlanc,
    };
    var overlays = {};
    L.control.layers(baseLayers, overlays).addTo(map);
  
  
    // ---------------------------//
    //      TOOLTIP               //
    // ---------------------------//
    // regarder overstack flow pour le problème de tooltip 
  
    // -1- Create a tooltip div that is hidden by default:
    var tooltip = d3.select("#tooltip_map")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip_map")
      .style("background-color", "#bdc2ca")
      .style("border-radius", "5px")
      .style("padding", "10px")
      .style("color", "white")
  
  
    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var showTooltip = function(d) {
      tooltip
        .transition()
        .duration(200)
      tooltip
        .style("opacity", 1)
        .html("<table>" + "<thead>" + "<tr>" + "<th>Compagnie</th>" + "<th>secteur</th>" + "<th>ID</th>" + "<th>Ville</th>" + "</tr>" + "</thead>" + "<tbody>" + "<tr>" + "<td>" + d.Compagny + "</td>" + "<td>" + d.Description_5 + "</td>" + "<td>" + d.Numeric_code + "</td>" + "<td>" + d.ADDRESSCITY + "</td>" + "</tr>" + "</tbody>" + "</table>")
        //"Il s'agit de la ville de : " + d.name + )
        .style("left", (d3.mouse(this)[0] + 30) + "px")
        .style("top", (d3.mouse(this)[1] + 30) + "px")
    }
    var moveTooltip = function(d) {
      tooltip
        .style("left", (d3.mouse(this)[0] + 30) + "px")
        .style("top", (d3.mouse(this)[1] + 30) + "px")
    }
    var hideTooltip = function(d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    }
  
    // create a colorscale
    
    var color = d3.scaleOrdinal()
      .domain(["a", "b", "c", "d", "e", "f"])
      .range(["#d73027", "#fdae61", "#fee08b", "#d9ef8b", "#66bd63", "#1a9850"])
     
    /*
     // create a colorscale
    var color = d3.scaleOrdinal()
      .domain(["0-25", "25-50", "50-75", "75-100"])
      .range(["#d73027", "#fdae61", "#d9ef8b", "#1a9850"])
     
    var color = d3.scaleThreshold()
      .domain([ 10, 25, 49, 74, 90, 100])
      .range(["#d73027","#fee08b", "#fdae61", "#d9ef8b", "#66bd63", "#1a9850"])
  
   */

    // ---------------------------//
    //       HIGHLIGHT GROUP      //
    // ---------------------------//
  
    // What to do when one group is hovered
    var highlight = function(d) {
      // reduce opacity of all groups
      d3.selectAll(".bubbles").style("opacity", .05)
      // expect the one that is hovered
      d3.selectAll("." + d).style("opacity", 1)
    }
  
    // And when it is not hovered anymore
    var noHighlight = function(d) {
      d3.selectAll(".bubbles").style("opacity", 1)
    }

    
  var radiusdivider = 5.3;
  var cities = [];
  var year = [];
  var citiesOverlay = (attribute = 'ESGSCORE_mean') => L.d3SvgOverlay(function(selection, projection) {
    // 1. Add x and y (cx, cy) to each row (circle) in data 
    const citiesWithcenter = cities.map(c => ({
        ...c,  // Rest parameters can be destructured (arrays only), that means that their data can be unpacked into distinct variables.
        x: projection.latLngToLayerPoint([c.latitude, c.longitude]).x,
        y: projection.latLngToLayerPoint([c.latitude, c.longitude]).y,
      }))
    // 2. node selection

      const node = selection
      .selectAll('circle')
      .data(citiesWithcenter)
      .enter()
      .append('circle')
      // .attr('r', function (d) {
      //   return Math.max(Math.pow(d.population, 0.57) / 40, 7)        })
             
      // .attr('r', function(d) {
      //   return Math.max(Math.pow(d.Market_Cap, 0.57) / 1000, 2);})

     .attr('r', function(d) {
         return Math.max(Math.log(d.Market_Cap)/radiusdivider, 2);})

    //  .attr('r', function(d) {
    //     return Math.max(Math.pow(Math.log(d.Market_Cap),1.4)/4, 1);})

          // .attr('r', function(d) {
          //   return d3.scaleLog(d.population).exponent(0.5) / 200, 10 ;})  
            
      .attr('cx', function (d) {
        return projection.latLngToLayerPoint([d.latitude, d.longitude]).x
      })
      .attr('cy', function (d) {
        return projection.latLngToLayerPoint([d.latitude, d.longitude]).y
      })
      .attr('class', function (d) {
        return 'bubbles ' + d[attribute]
      })
      .attr('stroke', 'white')
      .style('stroke-width', function (d) {
        return 0.5 / projection.scale
      })
      .style('fill', function (d) {
        return color(d[attribute])
      })
      .attr('stroke', '#FFFF')
      .attr('stroke-width', 1)
      .attr('fill-opacity', 0.9)
      .on('mouseover', showTooltip)
      .on('mousemove', moveTooltip)
      .on('mouseleave', hideTooltip)

 


  // Avoiding bubbles overlapping

  var simulationforce = d3
    .forceSimulation()
    .force('charge', d3.forceManyBody().strength(0))
    .force(
      'collide', // Force that avoids circle overlapping // 0 : overlapping ; 1 : dispersed
      d3.forceCollide().strength(0.07).radius(function (d) {
        // return Math.max(Math.pow(d.Market_Cap, 0.57) / 1000, 2 )
        return Math.max(Math.log(d.Market_Cap)/radiusdivider, 2)
        // return Math.max(Math.pow(Math.log(d.Market_Cap),1.4)/4, 1)
      }),)     
// By default : 
// iteration 1 : en ajouter augmente le coût computationnel
// collide--> strength 0 - 1 ; default : 0.7
// charge or gravity strength <0 >0 attraction / repulsion

      // var simulation = d3.forceSimulation()
      // .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
      // .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
      // .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.value)+3) }).iterations(1)) // Force that avoids circle overlapping
    
      // update with simulation
  simulationforce.nodes(citiesWithcenter).on('tick', function (d) {
      node
        .attr('cx', function (d) {
          return d.x
        })
        .attr('cy', function (d) {
          return d.y
        })
      })
  })   
    // https://www.d3indepth.com/force-layout/
    //Essai pour régler le problème de superposition des points à l'origine
    //d3.csv("https://raw.githubusercontent.com/Mathiaslauber/Interactivity_first_try/main/data/dataset_essai.csv", function(d) {
    d3.csv("data/scoresESGD3js.csv", function(d) {
      d.Market_Cap = parseInt(d.Market_Cap);
      return d;
    }).then(function(data) {
      cities = data;
      cities.sort(function(a, b) {
        return (a.Market_Cap > b.Market_Cap) ? -1 : ((b.Market_Cap > a.Market_Cap) ? 1 : 0);
      });
      citiesOverlay().addTo(map);
      
  
      d3.select('#well-form').on('change', function(e,d) {
              
          // Remove previously added cities overlay
          d3.select('.d3-overlay').remove()
          
          // add new overlay with currently selected radio value
          // "this" denotes the <form> node
          console.log(this.well.value)
          citiesOverlay(this.well.value).addTo(map);
      })
  
    });
      //------------------------------------------------------//
      //Set dimensions of side bar//
      //----------------------------------------------------//
    // set the dimensions and margins of the graph
    let margin_map = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
      },
      width = 500 - margin_map.left - margin_map.right,
      height = 620 - margin_map.top - margin_map.bottom;


      //------------------------------------------------------//
      //Création du Side Bar//
      //----------------------------------------------------//
  
    // append the svg object to the body of the page
    var svg_chorop = d3.select("#sidebar")
      .append("svg")
      .attr("width", width + margin_map.left + margin_map.right)
      .attr("height", height + margin_map.top + margin_map.bottom)
      .append("g")
      //.style("stroke", "red")
      //.style("fill", "red")
      .attr("transform",
        "translate(" + margin_map.left + "," + margin_map.top + ")");
  
     //------------------------------------------------------//
      //-------LEGENDE COULEUR CHOROPLETHE-------------------//
      //----------------------------------------------------//
      var mycolor = d3.scaleOrdinal()
      .domain(["f","e", "d", "c", "b", "a"])
      .range(["#1a9850","#66bd63", "#d9ef8b", "#fee08b", "#fdae61", "#d73027"])
    //.range(["#f1eef6", "#bdc9e1", "#74a9cf", "#2b8cbe", "#045a8d"]) 
    /*
    var myecocolor = d3.scaleOrdinal()
     .domain(["fin","bat", "agr", "tech"])
     .range(["#2b3a23","#529750", "#59691e", "#796326"])
      */


     var myecocolor = d3.scaleOrdinal()
     .domain(["z","u", "x", "y"])
     .range(["#2b3a23","#529750", "#59691e", "#796326"])



    /*
    
    var mycolor = d3.scaleOrdinal()
      .domain(["e", "d", "c", "b", "a"])
      .range(["#045a8d", "#2b8cbe", "#74a9cf", "#bdc9e1", "#f1eef6"])
    //.range(["#f1eef6", "#bdc9e1", "#74a9cf", "#2b8cbe", "#045a8d"]) 

      
    var mycolor = d3.scaleThreshold()
      .domain([ 10, 25, 49, 74, 90, 100])
      .range(["#d73027","#fee08b", "#fdae61", "#d9ef8b", "#66bd63", "#1a9850"])
  
*/
 // https://d3-graph-gallery.com/graph/bubble_template.html
  
    d3.csv("data/scoresESGD3js.csv", function(d) {
  
      //------------------------------------------------------//
      //Création du Side Bar//
      //----------------------------------------------------//
      var size = 30
      var allgroups = ["f","e", "d", "c", "b", "a"]
      var keys = ["100", "90", "75", "50", "25", "10"]
      //0.1, 0.4, 0.7, 1.1, 1.5, 2.7
  
      // ajout des carrés de la légende
      svg_chorop.selectAll("mydots")
        .data(allgroups)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", function(d, i) {
          return 60 + i * (size + 10)
        }) // 60 is where the first dot appears. 10 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d) {
          return mycolor(d)
        })
        .style("stroke", "#DCDCDC")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
  
  
      // Ajouter les chiffres percentiles aux carrés
      svg_chorop.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
        .attr("x", 0 + size * 1.2)
        .attr("y", function(d, i) {
          return 50 + i * (size + 10) + (size / 2)
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", "black")
        .text(function(d) {
          return d
        })
        .style("font-size", "16px")
        .attr("text-anchor", "left")
        .style("fill", colorlegend)
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
      //.on("mouseover", highlight)
      //.on("mouseleave", noHighlight)
  
      ////////////////////////////////////////////////////////////////////////
        /*
      var size = 30
      var allgroups = ["z","u", "x", "y"]
      var keys = ["z", "u", "x", "y"]
      //0.1, 0.4, 0.7, 1.1, 1.5, 2.7
      // ajout des carrés de la légende
      svg_chorop.selectAll("mydots")
      .data(allgroups)
      .enter()
      .append("rect")
      .attr("x", 150)
      .attr("y", function(d, i) {
        return 60 + i * (size + 10)
      }) // 60 is where the first dot appears. 10 is the distance between dots
      .attr("width", size)
      .attr("height", size)
      .style("fill", function(d) {
        return myecocolor(d)
      })
      .style("stroke", "#DCDCDC")
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight)


      // Ajouter les chiffres percentiles aux carrés
      svg_chorop.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
      .attr("x", 150 + size * 1.2)
      .attr("y", function(d, i) {
        return 50 + i * (size + 10) + (size / 2)
      }) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", "black")
      .text(function(d) {
        return d
      })
      .style("font-size", "16px")
      .attr("text-anchor", "left")
      .style("fill", colorlegend)
      .style("alignment-baseline", "middle")
      .on("mouseover", highlight)
      .on("mouseleave", noHighlight)
      //.on("mouseover", highlight)
      //.on("mouseleave", noHighlight)



      */


      ////////////////////////////////////////////////////////////////////////


      // Titre de la  légende 
      svg_chorop.append("text")
      .attr("x", 0).attr("y", 15)
      .text("Score [0-100]")
      .style("fill", colortitle)
      .style("font-size", "19px")
      .attr("alignment-baseline", "middle")
      // édition du style de la légende
      svg_chorop.append("text")
      .attr("x", 290).attr("y", 15)
      .style("fill", colortitle)
      .style("font-size", "22px")
      .attr("alignment-baseline", "middle")
      .attr('font-family', 'FontAwesome')
      .attr('font-size', '20px')
      .text(function(d) {
        return '\uf8cc'
      })
      // Sous-titre de la légende
      svg_chorop.append("text")
      .attr("x", 0).attr("y", 35)
      .text("moyenne entre 2014-2019")
      .style("fill", colorlegend)
      .style("font-size", "14px")
      .attr("alignment-baseline", "middle")

      //------------------------------------------------------.................................................................................................//
      //-------------------------------------------------------...............................................................................................//
      //-------------------------------------------------------..............................................................................................//
      // SELECTION SUR LE SECTEUR ECONOMIQUE -----------------..............................................................................................//
      //-------------------------------------------------------............................................................................................//
      //-------------------------------------------------------...........................................................................................//
     /* var ecosize = 30
      var ecosector = ["z","u", "x", "y"]
      var ecokeys = ["z", "u", "x", "y"]

      //0.1, 0.4, 0.7, 1.1, 1.5, 2.7
  
      // ajout des carrés de la légende
      svg_chorop.selectAll("mydots")
        .data(ecosector)
        .enter()
        .append("rect")
        .attr("x", 100)
        .attr("y", function(d, i) {
          return 120 + i * (ecosize + 10)
        }) // 60 is where the first dot appears. 10 is the distance between dots
        .attr("width", ecosize)
        .attr("height", ecosize)
        .style("fill", "#110808")
       
        .style("stroke", "#DCDCDC")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
  
        
      // Ajouter les chiffres percentiles aux carrés
      svg_chorop.selectAll("mylabels")
        .data(ecokeys)
        .enter()
        .append("text")
        .attr("x", 100 + ecosize * 1.2)
        .attr("y", function(d, i) {
          return 120 + i * (ecosize + 10) + (ecosize / 2)
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", "black")
        .text(function(d) {
          return d
        })
        .style("font-size", "16px")
        .attr("text-anchor", "left")
        .style("fill", colorlegend)
        .style("alignment-baseline", "middle")
        
      

      // Titre de la  légende 
      svg_chorop.append("text")
      .attr("x", 100).attr("y", 100)
      .text("Scores ESG [0-100]")
      .style("fill", colortitle)
      .style("font-size", "19px")
      .attr("alignment-baseline", "middle")
      // édition du style de la légende
      svg_chorop.append("text")
      .attr("x", 290).attr("y", 15)
      .style("fill", colortitle)
      .style("font-size", "22px")
      .attr("alignment-baseline", "middle")
      .attr('font-family', 'FontAwesome')
      .attr('font-size', '20px')
      .text(function(d) {
        return '\uf8cc'
      })
     */

      
      // ------------------------------------------------------------//
      //      CERCLE TAILLE : LEGENDES NOMBRE DE LOGEMENTS TOTAUX   //
      // ----------------------------------------------------------//
      //var valuesToShow = ["50'000", "150'000", "300'000", "600'000"]
      //50000;150000;300000;600000
      // The scale you use for bubble size
      /*var size = d3.scaleSqrt()
        .domain([0, 661505]) // valeur max correspond à Zurich agglo
        .range([1, 52]) // taille max du cercle selon la correction de Flannery
  
      // Add legend: circles
      var valuesToShow = [50000, 150000, 300000, 600000]
      var xCircle = 290
      var xLabel = 350
      var yCircle = 175

      svg_chorop
        .selectAll("mycircles")
        .data(valuesToShow)
        .enter()
        .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function(d) {
          return yCircle - size(d)
        })
        .attr("r", function(d) {
          return size(d)
        })
        .style("fill", "none")
        .attr("stroke", colorlegend)
  
  
      // Add legend: segments
      svg_chorop
        .selectAll("mysegments")
        .data(valuesToShow)
        .enter()
        .append("line")
        .attr('x1', function(d) {
          return xCircle
        })
        .attr('x2', xLabel)
        .attr('y1', function(d) {
          return yCircle - size(d) * 2
        })
        .attr('y2', function(d) {
          return yCircle - size(d) * 2
        })
        .attr('stroke', colorlegend)
        .style('stroke-dasharray', ('2,2'))
  
  
      // Add legend: labels
      svg_chorop
        .selectAll("mylabels")
        .data(valuesToShow)
        .enter()
        .append("text")
        .attr('x', xLabel + 5)
        .attr('y', function(d) {
          return yCircle - size(d) * 2
        })
        .text(function(d) {
          return d3.format(",")(d)
        })
        .style("font-size", 12)
        .style("fill", colorlegend)
        .attr('alignment-baseline', 'middle')
  
      /*
      // Legend title
      svg_chorop.append("text")
        .attr('x', xCircle + 15)
        .attr("y", yCircle + 25)
        .text("Market Cap en [$]")
        .attr("text-anchor", "middle")
        .attr("font-size", "17")
        .style("fill", colortitle)
  
      // subtitle
      svg_chorop.append("text")
        .attr('x', xCircle + 40)
        .attr("y", yCircle + 45)
        .text("*moyenne entre 2014-2019")
        .attr("text-anchor", "middle")
        .attr("font-style", "italic")
        .attr("font-size", "12px")
        .style("fill", colorlegend)
        .style("text-decoration", "italic")
        .style("letter-spacing", "-0.9px");
        */
      /*
    var annotations = [
      {
      note: {
        label: "Thanks to its marketing hed the third position.",
        title: "France product sales",
        wrap: 200,  // try something smaller to see text split in several lines
        padding: 10   // More = text lower
        
      }, 
      color: ["#46646f6c"],
      x: 500,
      y: 200,
      dy: 50,
      dx: 50
    }]
  //https://www.d3-graph-gallery.com/graph/custom_annotation.html
  //https://towardsdatascience.com/how-to-improve-d3-js-graphs-with-annotations-252fbb9c5bb5
  var makeAnnotations = d3.annotation()
    .annotations(annotations)
  svg_chorop.append("svg")
    .call(makeAnnotations)
  
  */
  
    })
  }
  map_symbol();
