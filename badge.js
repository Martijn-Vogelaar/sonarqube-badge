function drawChart(projectName, data, title, percentageShown) {
    var options = {
        pieHole: 0.5,
        pieSliceTextStyle: {
            color: 'white',
        },
        colors: ['#0a0', '#d4333f'],
        legend: 'none',
        enableInteractivity: false
    };
    var buildReport = document.getElementById(projectName + '-buildReport');
    var measurementDiv = document.createElement('div');
    measurementDiv.style = "float:left; position: relative; display: inline-block; vertical-align: top; text-align: center; box-sizing: border-box; padding: 0 15px; "

    var measurementName = document.createElement('div');
    measurementName.style = 'font-size: 13px; display: inline-block; vertical-align: top; text-align: center;'

    var measurementNameText = document.createTextNode(title);
    measurementName.appendChild(measurementNameText);

    var chartDiv = document.createElement('div');

    var chart = document.createElement('div');
    chart.id = projectName + title;
    chart.style = 'width: 50; height: 50; float:left;';

    chartDiv.appendChild(chart);

    var dataNumber = document.createElement('div');
    dataNumber.style = "float:left; transform: translateY(50%);"
    var dataText = document.createTextNode(percentageShown + "%");
    dataNumber.appendChild(dataText);
    chartDiv.appendChild(dataNumber);


    measurementDiv.appendChild(chartDiv);
    measurementDiv.appendChild(measurementName);
    buildReport.appendChild(measurementDiv);

    var wrapper = new google.visualization.ChartWrapper({
        chartType: 'PieChart',
        dataTable: data,
        options: options,
        containerId: projectName + title
    });
    wrapper.draw();

}

function drawQualityGate(projectName, status) {
    var color;
    if (status == "WARN") {
        color = '#ed7d20';
        status = 'Warning';
    } else if (status == "ERROR") {
        color = '#d4333f';
        status = 'Failed';
    } else if (status == "OK") {
        color = '#0a0';
        status = 'Passed';
    } else if (status == "Not found") {
        color = '#d4333f';
        status = 'Not found';
    }

    var title = document.getElementById(projectName + '-title');
    title.style = "height: 30px;"
    var projectNameDiv = document.createElement('div');
    projectNameDiv.style = "float:left;  margin-left: 20px; margin-right: 20px"
    var projectNameText = document.createTextNode(projectName);

    projectNameDiv.appendChild(projectNameText);

    var fitDiv = document.createElement('div');
    fitDiv.style = 'width: 80; float:left;';
    var qualityGateSpan = document.createElement('div');
    qualityGateSpan.style = "display: inline-block; float:left; min-width: 70px; height: 24px; line-height: 24px; border-radius: 24px; box-sizing: border-box; color: #fff; letter-spacing: .02em; font-size: 13px; font-weight: 400; text-align: center; text-shadow: 0 0 1px rgba(0,0,0,.35); background-color:" + color;
    var qualityGateText = document.createTextNode(status);
    qualityGateSpan.appendChild(qualityGateText);
    fitDiv.appendChild(qualityGateSpan);
    title.appendChild(fitDiv);
    title.appendChild(projectNameDiv);

}

function drawQualityNumber(projectName, amount, name, status) {
    var color;

    if (status == 1) {
        color = '#0a0'
    } else if (status == 2) {
        color = '#b0d513';
    } else if (status == 3) {
        color = '#eabe06';
    } else if (status == 4) {
        color = '#ed7d20'
    } else if (status == 5) {
        color = '#d4333f';
    }
    var buildReport = document.getElementById(projectName + '-buildReport');
    var qualityGateDiv = document.createElement('div');
    qualityGateDiv.style = "min-width: 100px; width: auto; height: 65.8px; float:left; position: relative; display: inline-block; vertical-align: top; text-align: center; box-sizing: border-box; padding-top: 10px; "

    var qualityGateName = document.createElement('div');
    qualityGateName.style = 'font-size: 13px; width:100%; position: absolute; bottom: 1px; left: 50%; transform: translateX(-50%);'
    var qualityGateNameText = document.createTextNode(name);
    qualityGateName.appendChild(qualityGateNameText);

    var qualityGateIndicator = document.createElement('div');
    qualityGateIndicator.style = "margin: auto; width: 30px; height: 30; line-height: 30px; border-radius: 30px; box-sizing: border-box; color: #fff; letter-spacing: .02em; font-size: 13px; font-weight: 400; text-align: center; text-shadow: 0 0 1px rgba(0,0,0,.35); background-color:" + color;
    var qualityGateText = document.createTextNode(amount);
    qualityGateIndicator.appendChild(qualityGateText);
    qualityGateDiv.appendChild(qualityGateIndicator);
    qualityGateDiv.append(qualityGateName);
    buildReport.appendChild(qualityGateDiv);
}


function createBadge(projectName) {


    var badge = document.createElement('div');
    badge.id = projectName + '-badge';
    badge.style = " margin-top: 20px;";

    var link = document.createElement('a');
    link.style = "display:block color: #000000";
    link.href = "http://ci.icaprojecten.nl/sonar/dashboard?id=" + projectName;
    link.appendChild(badge);

    var title = document.createElement('div');
    title.id = projectName + '-title'
    badge.appendChild(title);
    var buildReport = document.createElement('div');
    buildReport.id = projectName + '-buildReport';
    buildReport.style = "height:70px;";
    badge.appendChild(buildReport);

    var line = document.createElement('div');
    line.style = "display:block; border:none; color:white;height:1px;background:black;background: -webkit-gradient(radial, 50% 50%, 0, 50% 50%, 350, from(#000), to(#fff));"
    badge.appendChild(line);
    document.getElementById("badge-Container").appendChild(link);

    var xmlhttp = new XMLHttpRequest();
    var retryCount = 0;
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var projectStats = JSON.parse(this.responseText);
            var measurements = projectStats.component.measures;



            var coverage = 0;//                         coverage
            var bugs = 0;//                             bugs
            var reliabilityRating = 0;//                Bugs
            var newReliabilityRating = 0;//                Bugs
            var newMaintainabilityRating = 0;
            var maintainabilityRating = 0;//            CodeSmells
            var newSecurityRating = 0;//                   Vulnerabilities
            var securityRating = 0;//                   Vulnerabilities
            var vulnerabilities = 0;//                  vulnerabilities
            var codeSmells = 0; //                      code_smells
            var qualityGate = "ERROR" //WARN  && OK     alert_status
            var duplicatedLines = 0;   //               duplicated_lines_density
            for (var i = 0; i < measurements.length; i++) {
                if (measurements[i].metric == "coverage") {
                    coverage = measurements[i].value;
                } else if (measurements[i].metric == "bugs") {
                    bugs = measurements[i].value;
                } else if (measurements[i].metric == "vulnerabilities") {
                    vulnerabilities = measurements[i].value;
                } else if (measurements[i].metric == "code_smells") {
                    codeSmells = measurements[i].value;
                } else if (measurements[i].metric == "alert_status") {
                    qualityGate = measurements[i].value;
                } else if (measurements[i].metric == "duplicated_lines_density") {
                    duplicatedLines = measurements[i].value;
                } else if (measurements[i].metric == "reliability_rating") {
                    reliabilityRating = measurements[i].value;
                } else if (measurements[i].metric == "sqale_rating") {
                    maintainabilityRating = measurements[i].value;
                    window.alert(maintainabilityRating)
                } else if (measurements[i].metric == "security_rating") {
                    securityRating = measurements[i].value;
                } else if (measurements[i].metric == "new_reliability_rating") {
                    newReliabilityRating = measurements[i].periods[0].value;
                } else if (measurements[i].metric == "new_maintainability_rating") {
                    newMaintainabilityRating = measurements[i].periods[0].value;
                } else if (measurements[i].metric == "new_security_rating") {
                    newSecurityRating = measurements[i].periods[0].value;
                }
            }
            if(reliabilityRating == 0){
                reliabilityRating = newReliabilityRating;
            }
            if(securityRating == 0){
                securityRating = newSecurityRating;
            }
            if(maintainabilityRating == 0){
                maintainabilityRating = newMaintainabilityRating;
            }
            var codecoverage = google.visualization.arrayToDataTable([
                ['Coverage', 'Percentage'],
                ['Covered', parseFloat(coverage, 10)],
                ['Uncovered', 100 - parseFloat(coverage, 10)],
            ]);
            var duplications = google.visualization.arrayToDataTable([
                ['Duplications', 'Percentage'],
                ['Unique', 100 - parseFloat(duplicatedLines, 10)],
                ['Duplicated', parseFloat(duplicatedLines, 10)],
            ]);
            drawQualityGate(projectName, qualityGate);
            drawChart(projectName, codecoverage, 'Code Coverage', coverage);
            drawChart(projectName, duplications, 'Duplications', duplicatedLines);
            drawQualityNumber(projectName, bugs, 'Bugs', reliabilityRating);
            drawQualityNumber(projectName, codeSmells, 'Code Smells', maintainabilityRating);
            drawQualityNumber(projectName, vulnerabilities, 'Vulnerabilities', securityRating);
        } else if (this.status == 404 && retryCount == 3) {
            drawQualityGate(projectName, "Not found");
            buildReport.style = "";
        } else {
            retryCount++;
        }
    };
    xmlhttp.open("GET", "https://cors-anywhere.herokuapp.com/http://ci.icaprojecten.nl/sonar/api/measures/component?additionalFields=&componentKey=" + projectName + "&metricKeys=alert_status,quality_gate_details,bugs,vulnerabilities,code_smells,coverage,tests,duplicated_lines_density,duplicated_blocks,reliability_rating,new_reliability_rating,sqale_rating,new_maintainability_rating,new_security_rating,security_rating&format=json", true);
    xmlhttp.send();
}

function getSearchParameters() {
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray(prmstr) {
    var params = {};
    var prmarr = prmstr.split("&");
    for (var i = 0; i < prmarr.length; i++) {
        var tmparr = prmarr[i].split("=");
        params[tmparr[0]] = tmparr[1];
    }
    return params;
}



//file:///home/martijn/Desktop/htmltest/index.html?projectName1=WoR_Test&projectName2=WoR_as&projectName3=nl.han.oose.reims&projectName4=nl.ica.oose.reims&projectName5=org.han.ica.asd.c.beergame.pipeline.pr