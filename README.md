## employee-time-tracking

This is where you include your WebPart documentation.

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

### This webpart needs given columns:
We can give any name to the list and select that list from webpart properties but the column names should be exact same as given.
•	Title (Standard)
•	Description (Rich Text) 
•	CreatedBy (Standard)
•	CreatedDate (Standard)
•	OverTime(Yes/No)
•	Hours(Number)
•	Category (Choice)
    o	Billable
    o	Non-Billable
    o	Upskilling
    o	Meeting

### Deploy the Package
* Please find the solution sharepoint>solution>employee-time-tracking.sppkg file
* Upload it to App catalog site library
* Deploy the solution from ribbon option
* Add the App to the site we want from site contents
* Edit the page on which we need to add the webpart and search for EmployeeTimeTracking webpart and add it
* Save the page
