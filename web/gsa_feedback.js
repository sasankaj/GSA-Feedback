var webform_id = "feedback_usda";
// var drupal_url = "http://gsa-feedback.lndo.site:8000";
var drupal_url = "http://gsafeedback.lndo.site";
var example = '<div id="gsa_feedback" class="modal"></div>';
var successMessage = 'Thank you for your feedback!';
var failureMessage = 'We are experiencing technical difficulty recording your feedback. If this problem persists, please contact us for assistance.';
var modaltrigger = '<p style="position:absolute;bottom:0;right:0" id="gsa_feedback_modal_trigger"><a href="#gsa_feedback" rel="modal:open">Feedback</a></p>';
$("html").append(example).append(modaltrigger);
var username = 'admin';
var password = 'admin';
function getCsrfToken(callback) {
    $.get(drupal_url + '/rest/session/token')
        .done(function (data) {
            var csrfToken = data;
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
                    modal_markup += '<fieldset name="' + field_key + '"> <legend>' + field['#title'] + '</legend><ol>';
                    Object.keys(questions).forEach(function(questionkey,index){
                        modal_markup += '<li><div class="question likert-question">' + questions[questionkey] + '</div>';
                        modal_markup += '<div class="answers likert-answers">';
                        Object.keys(answers).forEach(function(answerkey, answerindex) {
                            modal_markup += '<span class="answer likert-answer-choice">';
                            modal_markup += '<input type="radio" name="' + field_key + ':' + questionkey + '" value="' + answerkey + '" class="form-radio">';
                            modal_markup += '<label for="' + field_key + ':' + questionkey + '">' + answers[answerkey] + '</label>';
                            modal_markup += "</span>";
                        });
                        modal_markup += '</li>';
                    });
                    modal_markup += '</ol></fieldset>';
                    modal_markup += '<input type="hidden" id="webform_id" name="webform_id" value="' + webform_id + '">';
                    modal_markup += '<input type="submit" value="Submit" /></form>';
                }
            }
            $('#gsa_feedback').html(modal_markup);
            $('#feedbackform').submit(function(event) {
                event.preventDefault();
                var formData = { };
                formData["webform_id"] = webform_id;
                $.each($('#feedbackform').serializeArray(), function() {
                    var group = this.name.substr(0,this.name.indexOf(':'));
                    if (group) {
                        if (formData[group] == undefined) {
                            formData[group] = {};
                        }
                        formData[group][this.name.substr(this.name.indexOf(':')+1)] = this.value;
                    }
                    else {
                        formData[this.name] = this.value;
                    }
                });
                getCsrfToken(function(csrfToken){
                    $.ajax({
                        url: $('#feedbackform').attr('action'),
                        dataType: 'json',
                        headers: {
                            "Content-Type": "application/json;charset=utf-8",
                        },
                        method:"POST",
                        data: JSON.stringify(formData),
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', 'Basic ' + btoa(username + ":" + password));
                            xhr.setRequestHeader('X-CSRF-Token', csrfToken);

                        },
                        success: function(result){
                            if(result["error"]) {
                                $('#gsa_feedback').html(failureMessage);
                            }
                            else {
                                $('#gsa_feedback').html(successMessage);
                            }
                            $('#gsa_feedback_modal_trigger').hide();
                        },
                        error: function(jqXHR, exception) {
                            $('#gsa_feedback').html(failureMessage);
                            $('#gsa_feedback_modal_trigger').hide();
                        }
                    })
                });
            });
        });
}});
