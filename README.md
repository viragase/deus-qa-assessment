Here's the complete README.md content ready for you to save as a file:

````markdown
# Booking.com Automation Script

This project automates a Booking.com search scenario using Selenium WebDriver with Node.js.

---

## Overview

The script performs the following actions on [Booking.com](https://www.booking.com):

- Opens the main Booking.com page.
- Enters "Porto" in the destination search field.
- Selects check-in and check-out dates (1st and 7th of the next month).
- Initiates the search.
- Prints the total number of properties found.
- Verifies and prints the selected check-in and check-out dates.
- Prints the names of all properties listed on the first results page.

---

## Prerequisites

- Node.js (v14 or later recommended)
- Google Chrome browser installed
- ChromeDriver compatible with your Chrome version

---

## Setup

1. Clone this repository or download the script file.

2. Navigate to the project directory and install dependencies:

```bash
npm install selenium-webdriver
````

3. Ensure ChromeDriver is installed and added to your system PATH or specify its path in the script if needed.

---

## Usage

Run the script using Node.js:

```bash
node index.js
```

The console will output:

* Confirmation messages for each action.
* Total number of properties found for Porto.
* Selected check-in and check-out dates.
* Names of all properties on the first page of search results.

---

## Notes

* The script maximizes the browser window for better visibility.
* It handles cookie consent banners if present.
* The dates are hardcoded for demonstration; modify them as needed.
* A screenshot is saved as `error_screenshot.png` in case of test failure for debugging.

---

## Troubleshooting

* If the script fails to locate elements, check for changes in Booking.com's page structure.
* Update ChromeDriver if your Chrome browser updates.
* Increase wait times if network latency causes timeouts.

---

Thank You!
