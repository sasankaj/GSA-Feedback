var webform_id = "feedback_usda";
var drupal_url = "http://gsafeedback.lndo.site";
var example = '<div id="gsa_feedback" class="modal"></div>';
var modaltrigger = '<p style="position:absolute;bottom:0;right:0"><a href="#gsa_feedback" rel="modal:open">Feedback</a></p>';
$("html").append(example).append(modaltrigger);
var username = 'admin';
var password = 'admin';
function getCsrfToken(callback) {
    $.get(drupal_url + '/rest/session/token')
        .done(function (data) {
            var csrfToken = data;
            console.log(csrfToken);
            callback(csrfToken);
        });
}
$.ajax({
    url: drupal_url + '/webform_rest/' + webform_id + '/elements?_format=json',
    dataType: 'json',
    headers: {
        Accept: "application/vnd.api+json",
    },
    method : 'GET',
    beforeSend: function (xhr) {

        xhr.setRequestHeader('Authorization', 'Basic ' + btoa(username + ":" + password));

    },
    success: function(result){
        var modal_markup = '<form id="feedbackform" action="' + drupal_url + '/webform_rest/submit" method="post">';
        Object.keys(result).forEach(function(field_key,index) {
            if (field_key.charAt(0) != '#') {
                var field = result[field_key];
                if (field['#type'] == "webform_likert") {
                    var questions = field["#questions"];
                    var answers = field["#answers"];
                    var answer_keys = Object.keys(answers);
                    modal_markup += '<table class="likert_table"><thead><tr>Question</tr><tr>';
                    Object.keys(answers).forEach(function(key,index){
                        modal_markup += '<td>' + answers[key] + '</td>';
                    });
                    modal_markup += '</tr></thead><tbody>';
                    Object.keys(questions).forEach(function(questionkey,index){
                        modal_markup += "<tr>";
                        modal_markup += "<td>" + questions[questionkey] + "td";
                        Object.keys(answers).forEach(function(answerkey, answerindex) {
                            modal_markup += "<td>";
                            modal_markup += '<input type="radio" name="' + field_key + '[' + questionkey + ']" value="' + answerkey + '" class="form-radio">';
                            modal_markup += "<td>";
                        });
                        modal_markup += "</tr>"
                    });
                    modal_markup += "</thead></table>";
                    modal_markup += '<input type="hidden" id="webform_id" name="webform_id" value="' + webform_id + '">';
                    modal_markup += '<input type="submit" value="Submit" /></form>';
                }
            }
            $('#gsa_feedback').html(modal_markup);
            $('#feedbackform').submit(function(event) {
                event.preventDefault();

                var formData = { };
                //formData["webform_id"] = webform_id;
                $.each($('#feedbackform').serializeArray(), function() {
                    formData['"'+this.name+'"'] = +this.value;
                });

                //var formData1 = {};
                //$('#feedbackform').serializeArray().map(function(x){formData1[x.name] = x.value;});
                //formData1 = '[{"webform_id": "feedback_usda", "usda[satisfaction]": "Option 1", "usda[confidence]": "Option 1", "usda[service]": "Option 1", "usda[process_ease]": "Option 1", "usda[process_equity]": "Option 1", "usda[process_efficiency]": "Option 1", "usda[people]":  "Option 1"}]';
                //formData2 = '[{"webform_id":"feedback_usda","usda[satisfaction]":["Option 1"],"usda[confidence]":["Option 1"],"usda[service]":["Option 1"],"usda[process_ease]":["Option 1"],"usda[process_equity]":["Option 1"],"usda[process_efficiency]":["Option 1"],"usda[people]":["Option 1"]}]';
                //formData2 = '[{"webform_id":"feedback_usda", "usda[satisfaction]":"1", "usda[confidence]":"1", "usda[service]":"1", "usda[process_ease]":"1", "usda[process_equity]":"1", "usda[process_efficiency]":"1", "usda[people]":"1"}]';
                //formData2 = '[{"webform_id":[feedback_usda],"usda[satisfaction]":[1],"usda[confidence]":[1],"usda[service]":[1],"usda[process_ease]":[1],"usda[process_equity]":[1],"usda[process_efficiency]":[1],"usda[people]":[1]}]';

                formData2 = "[{\"webform_id\": [\"feedback_usda\"],\"usda[satisfaction]\": 1}]";

                //formData2 = JSON.stringify(formData2)
                console.log("-----------------------");
                console.log(formData2);
                console.log("-----------------------");



                //console.log(JSON.stringify(formData1));

                getCsrfToken(function(csrfToken){
/*
                  $.ajax({
                      "async": true,
                      "crossDomain": true,
                      "url": "http://gsafeedback.lndo.site/webform_rest/submit?_format=json",
                      "method": "POST",
                      "headers": {
                        "Content-Type": "application/json",
                        "Accept": "application/vnd.api+json",
                        "Cache-Control": "no-cache",
                      },
                      beforeSend: function (xhr) {
                        xhr.setRequestHeader('Authorization', 'Basic ' + btoa(username + ":" + password));
                        xhr.setRequestHeader('X-CSRF-Token', csrfToken);
                      },
                      "data": formData1,
                      success : function(ajaxData) {
                        console.log("******");
                        console.log(ajaxData);
                        console.log("******");
                        if (ajaxData.status == 'OK')
                          alert('Person has been added');
                        else
                          alert('Failed adding person: '
                              + ajaxData.status + ', '
                              + ajaxData.errorMessage);
                      }
                 })
*/
                  //"Authorization": "Basic "+ btoa(username + ":" + password),
                  //"url": $('#feedbackform').attr('action') + "/?_format=json",


                    $.ajax({
                        "method": "POST",
                        "headers": {
                          "Content-Type": "application/json",
                          "Accept": "application/vnd.api+json",
                        },
                        "url": "http://gsafeedback.lndo.site/webform_rest/submit",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(username + ":" + password));
                            xhr.setRequestHeader('X-CSRF-Token', csrfToken);
                        },
                      "data": formData2,

                      success : function(ajaxData) {
                            console.log("******");
                            console.log(ajaxData);
                        console.log("******");
                        if (ajaxData.status == 'OK')
                          alert('feedback is received');
                        else
                          alert('Feedback could not be added! : '
                              + ajaxData.status + ', '
                              + ajaxData.errorMessage);
                      }

                    })

                });
            });
        });
}});
