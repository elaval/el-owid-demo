# POC for modularizing OWID chart components

Our World in Data (OWID) is an initiative that aims at **research and data to make progress against the world’s largest problems**.  They collect and mantain hundreds of datasets from worlwide public data that is transformed into meaningful information via evidence based articles and data visualisations.

They currently have a powerful visualization tool - OWID Grapher - that has been designed to easily create, and publish, visualization information on top of new datasets.  The tool is great, but it is tightly coupled to the backend (Mysql queries to retreive data, within a React website).

This repository is a POC with some initial ideas to think about alternative ways to architect and decouple the visualization, page and data components.

## Step 1 - decouple data from frontend code
Instead of making direct queries to the database (via SQL) as an core part of the visualization code, we can decouple the data fro the presentation layer.

Data can be retreived in a flexible way via APIS (or standalone Parquet datafiles) that could be retreived and managed via Javascript on the client.

OWID currently provide easy access to data & metadata via api calls such as:

https://ourworldindata.org/grapher/data/variables/metadata/${variableId}.json

https://ourworldindata.org/grapher/data/variables/data/${variableId}.json

Data is organized on hundreds of datasets identified by a variable Id (e.g. 1454)

## Step 2 - modular visualization components
Instead of a visualization tool that is tightly coupled to a specific front-end architecture and technology, it is possible to build a library of reusable components that are specifically tailored to the type of visualization and data that OWID wants to make accesible.

If we have a sound architectural foundation, OWID vis components could be cretaed by a core team at OWID but highly enriched by an open source community.  These tools could be available for developers (and projects) distributed around the world to easily access and present "data stories".

This repository is an extremely basic POC of this concept.  We create a visualization componnet that can be distributed as a javascript package (technically an npm package) that could be reused in Javascript code or in platforms such as observable explorer.

Here you can access a very basic demo (a plain html file stored in a file storage service) that loads the visualization component, retreived the data from OWID Backend and renders a trend chart.

<a src="https://elaval.s3.amazonaws.com/owid/basicDemo/index.html" target="_blank">https://elaval.s3.amazonaws.com/owid/basicDemo/index.html</a>

