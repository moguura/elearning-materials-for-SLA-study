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

// 学習時間設定
lmsAPI.SetValue("cmi.core.session_time", sessionTime);

// 完了状態設定
lmsAPI.SetValue("cmi.core.lesson_status", "completed");

// 問題ごとの回答データを記録
var interactions = [];
for (var i = 21; i <= 25; i++) { // Q21～Q25まで対応
    var questionId = "Q" + i;
    var response = player.GetVar(questionId + "_Response"); // 学習者の回答

    interactions.push({
        id: questionId,
        response: response
    });
}

interactions.forEach(function(interaction, index) {
    lmsAPI.SetValue(`cmi.interactions.${index}.id`, interaction.id);
    lmsAPI.SetValue(`cmi.interactions.${index}.student_response`, interaction.response);
});

// データ保存
lmsAPI.CommitData();

}

};
