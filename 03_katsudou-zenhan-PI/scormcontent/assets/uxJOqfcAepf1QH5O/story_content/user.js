window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var once = player.once;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
window.Script1 = function()
{
  var player = GetPlayer();
var lmsAPI = parent;

// 学習時間の計算（秒単位）
var elapsedTime = player.GetVar("ElapsedTime"); // Storyline変数から取得
function formatTime(seconds) {
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = seconds % 60;
    return (
        (h < 10 ? "0" + h : h) +
        ":" +
        (m < 10 ? "0" + m : m) +
        ":" +
        (s < 10 ? "0" + s : s)
    );
}
var sessionTime = formatTime(elapsedTime);

// スコア設定
var score = player.GetVar("Quiz2.ScorePoints"); // スコア変数から取得
var maxScore = 10; // Story2の問題数
lmsAPI.SetValue("cmi.core.score.raw", score);
lmsAPI.SetValue("cmi.core.score.min", "0");
lmsAPI.SetValue("cmi.core.score.max", maxScore);

// 学習時間設定
lmsAPI.SetValue("cmi.core.session_time", sessionTime);

// 完了状態設定
lmsAPI.SetValue("cmi.core.lesson_status", "completed");

// 問題ごとの正解・不正解を記録
var interactions = [];
for (var i = 11; i <= 20; i++) { // Q11～Q20まで対応
    var questionId = "Q" + i;
    var result = player.GetVar(questionId + "_Result");
    var response = player.GetVar(questionId + "_Response");
    var correctAnswer = player.GetVar(questionId + "_CorrectAnswer");

    interactions.push({
        id: questionId,
        result: result,
        response: response,
        correctAnswer: correctAnswer
    });
}

interactions.forEach(function(interaction, index) {
    lmsAPI.SetValue(`cmi.interactions.${index}.id`, interaction.id);
    lmsAPI.SetValue(`cmi.interactions.${index}.result`, interaction.result);
    lmsAPI.SetValue(`cmi.interactions.${index}.student_response`, interaction.response);
    lmsAPI.SetValue(`cmi.interactions.${index}.correct_responses.0.pattern`, interaction.correctAnswer);
});

// データ保存
lmsAPI.CommitData();

}

};
