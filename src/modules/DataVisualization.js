/*
  "DataVisualization" Module:
    - visualizes provided qualitative data using d3 hierarchy, tree layout.
*/

import * as d3 from "d3";


const DataVisualization = {

  settings: {
    data: {},
    updateSvg: true
  },

  getData: function(data) {
    this.settings.data = data;
    this.render();
  },

  // WHERE 0 IS THE DAMN REFERENCE TO THE G ELEMENT WHICH ENCOMPASSES EVERYTHING HYPE;
  // $0.getBoundingClientRect().width;
  // 13220;

  render: function(/* testParam */) {
    let testRootData = this.settings.data;

    document.getElementById('chart').innerHTML = '';

    let margin = {top: 50, right: 50, bottom: 150, left: 50},
        width = /* testParam || 1 */ 1000,
        height = 1000;

    let rectWidth = 200,
        rectHeight = 100,
        nodeMargin = 10;

    let nodeSizeArray = [rectWidth + nodeMargin, rectHeight];

    // Establishing the svg chart and group for content.
    let svg = d3.select('#chart')
                .append('svg')
                .attr('width', width /* + margin.right + margin.left */)
                .attr('height', height /* + margin.top + margin.bottom */);

    let gSvg = svg.append('g')
                  .attr('class', 'content')
                  .attr('transform', `translate(${width / 2}, 20)`);

    // Formatting the qualitative data in a hierarchical format so it can be understand by the tree layout.
    let hierarchicalData = d3.hierarchy(testRootData, d => d.scripts);

    // Defining the tree layout.
    let tree = d3.tree()
                 .nodeSize(nodeSizeArray)
                 .separation((a, b) => a.parent == b.parent ? 1 : 1.25);

    // Passing the formatted data to the tree layout.
    let treeData = tree(hierarchicalData);


    updateRender();

    // Updates nodes, links, and spacing for collapsibility amongst other features...
    function updateRender() {
      // Controls the distance between adjacent parent and child nodes.
      treeData.descendants().forEach(d => (d.y = d.depth * 200));

      // ... provides linking for nodes
      let link = gSvg.selectAll('.link')
                    .data(treeData.descendants().slice(1))
                    .enter()
                    .append('path')
                    .attr('class', 'link')
                    .attr('d', d => (
                      `M${d.x}, ${d.y}
                       C${d.x}, ${(d.y + d.parent.y) / 2}
                       ${d.parent.x}, ${(d.y + d.parent.y) / 2}
                       ${d.parent.x}, ${d.parent.y}`
                    ));

      // Defines the node which holds it's respective information.
      let node = gSvg.selectAll('g.node')
                    .data(treeData.descendants())
                    .enter()
                    .append('g')
                    .attr('class', 'node')
                    // Translates each node to it's respective x and y coordinates as calculated by the tree layout.
                    .attr('transform', d => `translate(${d.x}, ${d.y})`);

      // Appends rect for each node as a container for information.
      node.append('rect')
          .attr('width', rectWidth)
          .attr('height', rectHeight)
          .attr('x', -(rectWidth / 2));

      // Appends a foreignObject which allows html to be added (used to supply a div for text wrapping to work).
      let foreignObject = node.append('foreignObject')
                              .attr('width', rectWidth)
                              .attr('height', rectHeight)
                              .attr('x', -(rectWidth / 2));

      // Appends div to the foreignObject.
      let div = foreignObject.append('xhtml:div')
                             .attr('width', rectWidth)
                             .attr('class', 'nodeDiv');

      // Appends relevant text to the div in a p tag.
      div.append('p')
         .html(d => d.data.text);

      // Adjusts svg size and group position should the chart take up more space.
      let treeWidth = gSvg.node().getBoundingClientRect().width;

      if (treeWidth !== width)  {
        svg.attr('width', treeWidth);
        gSvg.attr('transform', `translate(${treeWidth / 2}, 20)`);
      }

    }

    function collapse(d) {
      if (d.children) {
          d._children = d.children;
          d._children.forEach(collapse);
          d.children = null;
      }
    }

    function click(d) {
      if (d.children) {
          d._children = d.children;
          d.children = null;
      } else {
          d.children = d._children;
          d._children = null;
      }
      update(d);
    }

  }


}

export default DataVisualization;
