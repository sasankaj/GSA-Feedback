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

## Usage Instructions

* Test your application
```
open the file web/test.html in a browser window to start testing.
```

