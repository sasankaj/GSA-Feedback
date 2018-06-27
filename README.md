## Setup Instructions


* Clone this repository into your local machine
```
git clone https://github.com/dgroene/GSA-Feedback.git
```
* Go to the project directory and start your lando container
```
cd ../GSA-Feedback

lando start
```
* Install all composer dependencies 
```
lando composer install
```
* Import the latest database
```
lando db-import drupal8.201806211529594302.gz
```
* Compile the latest css files
```
cd ./widget/uswds
npm install
gulp build
```

## Testing Instructions

* Test your application
```
open the file widget/feedback.html in a browser window to start testing.
```


## Usage Instructions

* To use the feedback widget in your site, add the following lines of code to a page on your site
```
    <!-- Remember to include jQuery :) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0/jquery.min.js"></script>

    <!-- jQuery Modal -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.css" />

    <!-- Remove all existing styles for this widget -->
    <link rel="stylesheet" href="css/reset.css"/>

    <!-- Include customized CSS from uswds -->
    <link rel="stylesheet" href="uswds/dist/css/uswds.min.css">

    <!-- Include additional styles -->
     <link rel="stylesheet" href="css/feedback.css"/>

    <!-- Include the gsa feedback widget js -->
    <script src="http://gsafeedback.lndo.site/gsa_feedback.js"></script>

```

* Copy the uswds and css directories from the widget directory into a relevant location your project
