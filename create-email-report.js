const fs = require('fs');
const path = require('path');

// Paths to the merged JSON report and output HTML file
// const integrationReportPath = path.join(__dirname,'cypress', 'output.json');
const integrationReportPath = path.join(__dirname, 'component_test_report.json');
const componentReportPath = path.join(__dirname, 'component_test_report.json');
const outputPath = path.join(__dirname, 'email-report.html');

// Read and parse the merged JSON report
const integrationReportData = JSON.parse(fs.readFileSync(integrationReportPath, 'utf8'));
const componentReportData = JSON.parse(fs.readFileSync(componentReportPath, 'utf8'));

// Initialize total counters
const totalIntegrationPassed = 0;
const totalIntegrationFailed = 0;
const totalIntegrationSkipped = 0;

// Initialize total counters
const totalComponentPassed = 0;
const totalComponentFailed = 0;
const totalComponentSkipped = 0;

// Array to store per-spec results
const integrationSpecResults = [];
const componentSpecResults = [];

// Recursive function to count passed, failed, and skipped tests in suites
// and collect failed/skipped test descriptions
function countTestsInSuite(suite, counters, failedTests, skippedTests) {
  suite.tests.forEach((test) => {
    if (test.state === 'passed') {
      counters.passed++;
    } else if (test.state === 'failed') {
      counters.failed++;
      failedTests.push(test.title); // Collect failed test description
    } else if (test.state === 'skipped') {
      counters.skipped++;
      skippedTests.push(test.title); // Collect skipped test description
    }
  });
  // Recursively process child suites
  if (suite.suites && suite.suites.length > 0) {
    suite.suites.forEach((childSuite) => {
      countTestsInSuite(childSuite, counters, failedTests, skippedTests);
    });
  }
}

// Define a function to process each spec file in the report

function processResults(reportData, totalPassed, totalFailed, totalSkipped, specResults) {
  reportData.results.forEach((spec) => {
    const specFileName = path.basename(spec.file);
    const counters = { passed: 0, failed: 0, skipped: 0 };
    const failedTests = []; // To store failed test descriptions
    const skippedTests = []; // To store skipped test descriptions

    // Count pass/fail/skipped tests recursively and collect test descriptions
    if (spec.suites && spec.suites.length > 0) {
      spec.suites.forEach((suite) => {
        countTestsInSuite(suite, counters, failedTests, skippedTests);
      });
    }

    // Update total counters
    totalPassed += counters.passed;
    totalFailed += counters.failed;
    totalSkipped += counters.skipped;

    // Store spec results along with failed/skipped test descriptions
    specResults.push({
      specFileName,
      passed: counters.passed,
      failed: counters.failed,
      skipped: counters.skipped,
      failedTests,
      skippedTests,
    });
  });
}

// Process the integration test report
processResults(
  integrationReportData,
  totalIntegrationPassed,
  totalIntegrationFailed,
  totalIntegrationSkipped,
  integrationSpecResults,
);

// Process the component test report
processResults(
  componentReportData,
  totalComponentPassed,
  totalComponentFailed,
  totalComponentSkipped,
  componentSpecResults,
);

// Process each spec file in the report

const totalIntegrationTests = totalIntegrationPassed + totalIntegrationFailed + totalIntegrationSkipped;
const percentagePassed = (totalIntegrationPassed / totalIntegrationTests) * 100;
const percentageFailed = (totalIntegrationFailed / totalIntegrationTests) * 100;
const percentageSkipped = (totalIntegrationSkipped / totalIntegrationTests) * 100;

const totalComponentTests = totalComponentPassed + totalComponentFailed + totalComponentSkipped;
const percentageComponentPassed = (totalComponentPassed / totalComponentTests) * 100;
const percentageComponentFailed = (totalComponentFailed / totalComponentTests) * 100;
const percentageComponentSkipped = (totalComponentSkipped / totalComponentTests) * 100;

// Initialize HTML content
let htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Segue Integration Tests Summary</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      width: 100%; 
      margin: 50px auto; 
      display: flex; 
      flex-direction: column; 
      justify-content: center; 
      align-items: center; 
    }
    table { 
      width: 60%; 
      border-collapse: collapse; 
      margin-bottom: 30px;
    }
    th, td { 
      border: 1px solid #ddd; 
      padding: 8px; 
      text-align: left; 
    }
    th { 
      background-color: #f2f2f2; 
    }
    .passed { color: green; }
    .failed { color: red; }
    .skipped { color: gray; }
    .test-list { 
      width: 80%; 
      margin-bottom: 30px; 
    }
    .test-list h3 {
      margin-bottom: 10px;
    }
    .test-list ul {
      list-style-type: disc;
      margin-left: 20px;
    }
    .piechart {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin: 50px;
    background-image: conic-gradient(
        green 0 ${percentagePassed}%,
        red ${percentagePassed}% ${percentageFailed + percentagePassed}%,
        grey ${percentageFailed + percentagePassed}% 100%
    );
    .top-summary {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }
    .summary-block {
      display: flex;
      flex-direction: column;
      align-items: start;
      font-size: 1.3em;
    }
    
    
}
  </style>
</head>
<body>
  <h1>Segue Tests Summary</h1>
  <div class="top-summary">
  
      <div class="summary-block">
            <h3>Integration Tests</h3>
            <strong>Total Passed:</strong> <span class="passed">${totalIntegrationPassed} - ${Math.round(
              percentagePassed,
            )}% </span> <br>
            <strong>Total Failed:</strong> <span class="failed">${totalIntegrationFailed} - ${Math.round(
              percentageFailed,
            )}%</span><br>
            <strong>Total Skipped:</strong> <span class="skipped">${totalIntegrationSkipped} - ${Math.round(
              percentageSkipped,
            )}%</span>
       </div>
       
       <div class="summary-block">
            <h3>Component Tests</h3>
            <strong>Total Passed:</strong> <span class="passed">${totalComponentPassed} - ${Math.round(
              percentageComponentPassed,
            )}% </span> <br>
            <strong>Total Failed:</strong> <span class="failed">${totalComponentFailed} - ${Math.round(
              percentageComponentFailed,
            )}%</span><br>
            <strong>Total Skipped:</strong> <span class="skipped">${totalComponentSkipped} - ${Math.round(
              percentageComponentSkipped,
            )}%</span>
      </div>
       
  </div>
  <div class="piechart"></div>
  <h2>Integration Test by module</h2>
  <table>
    <tr>
      <th>Spec File</th>
      <th>Passed Tests</th>
      <th>Failed Tests</th>
      <th>Skipped Tests</th>
    </tr>
`;

// Append spec results to the HTML content
integrationSpecResults.forEach((specResult) => {
  // Capitalize the first letter of the spec file name (without extension)
  const specName = specResult.specFileName.split('.')[0].replace(/^./, (char) => char.toUpperCase());

  htmlContent += `
    <tr>
      <td>${specName}</td>
      <td class="passed">${specResult.passed}</td>
      <td class="failed">${specResult.failed}</td>
      <td class="skipped">${specResult.skipped}</td>
    </tr>
    `;
});

// Close the table
htmlContent += `
  </table>
`;

// Add a table for component test results
htmlContent += `
<table>
    <tr>
      <th>Spec File</th>
      <th>Passed Tests</th>
      <th>Failed Tests</th>
      <th>Skipped Tests</th>
    </tr>
`;

// Append spec results to the HTML content
componentReportData.forEach((specResult) => {
  // Capitalize the first letter of the spec file name (without extension)
  const specName = specResult.specFileName.split('.')[0].replace(/^./, (char) => char.toUpperCase());

  const fontColor = specResult.failed > 0 ? 'red' : 'green';

  htmlContent += `
    <tr style="color: ${fontColor}">
      <td>${specName}</td>
      <td class="passed">${specResult.passed}</td>
      <td class="failed">${specResult.failed}</td>
      <td class="skipped">${specResult.skipped}</td>
    </tr>
    `;
});

// Close the table
htmlContent += `
  </table>
`;

// Add Component Test details section
htmlContent += `
  <h1>Details</h1>
 `;

// Add Failed and Skipped Test Descriptions Section
htmlContent += `
  <div class="test-list">
    <h3>Failed Component Tests</h3>
    `;

let anyComponentFailed = false;

// Iterate over specResults to list failed tests

componentSpecResults.forEach((specResult) => {
  if (specResult.failedTests.length > 0) {
    anyComponentFailed = true;
    const specName = specResult.specFileName.split('.')[0].replace(/^./, (char) => char.toUpperCase());
    htmlContent += `
    <h4>${specName}</h4>
    <ul>
        ${specResult.failedTests.map((test) => `<li>${test}</li>`).join('')}
    </ul>
        `;
  }
});

if (!anyComponentFailed) {
  htmlContent += `<p>No failed tests.</p>`;
}

htmlContent += `
  </div>
`;

// Add Skipped Test Descriptions Section

htmlContent += `
  <div class="test-list">
    <h3>Skipped Component Tests</h3>
`;

let anyComponentSkipped = false;

// Iterate over specResults to list skipped tests
componentSpecResults.forEach((specResult) => {
  if (specResult.skippedTests.length > 0) {
    anyComponentSkipped = true;
    const specName = specResult.specFileName.split('.')[0].replace(/^./, (char) => char.toUpperCase());
    htmlContent += `
    <h4>${specName}</h4>
    <ul>
        ${specResult.skippedTests.map((test) => `<li>${test}</li>`).join('')}
    </ul>
        `;
  }
});

if (!anyComponentSkipped) {
  htmlContent += `<p>No skipped tests.</p>`;
}

htmlContent += `
  </div>
`;

// Add Failed and Skipped Test Descriptions Section
htmlContent += `
  <div class="test-list">
    <h3>Failed Integration Tests</h3>
`;

let anyIntegrationFailed = false;

// Iterate over specResults to list failed tests
integrationSpecResults.forEach((specResult) => {
  if (specResult.failedTests.length > 0) {
    anyIntegrationFailed = true;
    const specName = specResult.specFileName.split('.')[0].replace(/^./, (char) => char.toUpperCase());
    htmlContent += `
    <h4>${specName}</h4>
    <ul>
        ${specResult.failedTests.map((test) => `<li>${test}</li>`).join('')}
    </ul>
        `;
  }
});

if (!anyIntegrationFailed) {
  htmlContent += `<p>No failed tests.</p>`;
}

htmlContent += `
  </div>
`;

// Add Skipped Test Descriptions Section
htmlContent += `
  <div class="test-list">
    <h3>Skipped Integration Tests</h3>
`;

let anyIntegrationSkipped = false;

// Iterate over specResults to list skipped tests
integrationSpecResults.forEach((specResult) => {
  if (specResult.skippedTests.length > 0) {
    anyIntegrationSkipped = true;
    const specName = specResult.specFileName.split('.')[0].replace(/^./, (char) => char.toUpperCase());
    htmlContent += `
    <h4>${specName}</h4>
    <ul>
        ${specResult.skippedTests.map((test) => `<li>${test}</li>`).join('')}
    </ul>
        `;
  }
});

if (!anyIntegrationSkipped) {
  htmlContent += `<p>No skipped tests.</p>`;
}

htmlContent += `
  </div>
</body>
</html>
`;

// Write the HTML content to the output file
fs.writeFileSync(outputPath, htmlContent, 'utf8');

console.log('Email report generated at:', outputPath);
