# The Road to Vision Zero: Traffic Crashes and Poverty in New York City
**An interactive web application built on CARTO and D3 for visualizing relationships between traffic crashes and poverty in NYC. Click [here](https://parkerziegler.github.io/transalt-visionzero-app/) to see it in action.**

*This repo is a result of data analysis completed as part of the 2016 Summer of Maps Program. This work was completed in support of a pro bono project with [Transportation Alternatives](https://www.transalt.org/).*

*[Summer of Maps](http://www.summerofmaps.com/) is a fellowship program organized and facilitated by [Azavea](https://www.azavea.com/). Azavea is a B Corporation that specializes in civic-minded GIS software development and spatial analysis.*
*Summer of Maps offers stipends to student spatial analysts to perform data analysis and visualization for non-profit organizations. Every year we match up non-profit organizations that have spatial analysis needs with talented students to implement projects over a three-month period during the summer.*

### Purpose of the Work
[Transportation Alternatives](https://www.transalt.org/) expressed interest in developing an interactive web application that would allow users to explore suspected relationships between traffic crashes and poverty in New York City. To do this, the Summer of Maps Fellow for this project, Parker Ziegler, decided to integrate *geospatial visualization* techniques using the [CARTO javascript library](https://carto.com/docs/carto-engine/carto-js/) with *statistical visualization* techniques using the [D3 javascript library](https://d3js.org/).

Dropdown menus are used as the central control point for the visualization. Using [jQuery](https://jquery.com/), layer changes and D3 transitions are wired to the dropdowns in the dashboard, allowing for data views that respond dynamically to user input and hide extraneous information. [Leaflet](http://leafletjs.com/) is also used in the visualization to generate tooltips.

The ultimate design vision for this project was to create an experience that was intuitive and engaging for both short-term (30 second) and long-term (10-15 minute) users, and that was sensitive to the different ways that people intuit information. 

### Intended Use for this Work
This web application is intended for use by New York City community organizations, businesses, political bodies, and the general public. The hope is that this application can allow interested users to explore data on traffic crashes and poverty in their own city council districts or boroughs. We hope, as well, that it motivates people to take action.

The code for this application is open and free to be forked, modified, or repurposed.

### Acknowledgements
[Parker Ziegler](http://parkerziegler.com/) was the lead developer and designer for this project. Special thanks to Daniel McGlone, Senior GIS Analyst at Azavea, for his mentorship on this project.

Thanks are also due to [Mike Bostock](https://bost.ocks.org/mike/), the creator of D3, and [Scott Murray](http://alignedleft.com/tutorials) for his extremely helpful D3 tutorials.

Crash data for this project came courtesy of Transportation Alternatives. Socioeconmic and demographic data came courtesy of the U.S. Census Bureau's American Community Survey. Shapefiles for NYC administrative boundaries came from NYC Open Data.
