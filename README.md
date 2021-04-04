## employee-time-tracking

This is where you include your WebPart documentation.

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO

### Deploy the Package
* Please find the solution sharepoint>solution>employee-time-tracking.sppkg file
* Upload it to App catalog site library
* Deploy the solution from ribbon option
* Add the App to the site we want from site contents
* Edit the page on which we need to add the webpart and search for EmployeeTimeTracking webpart and add it
* Save the page
