'use strict';
// ABC data selected from the canonical CHARACTERS and STORY. Provisional kana/TTS omitted.
window.LESSON_DATA = {
a: {name:'Annie Apple', jp:'アニー アップル', story:'アニーは、赤くて まるい、おいしい りんご。口に はこんで、音を いってみよう。', original:'Annie Apple is red, round and delicious. You bring her to your mouth and say “a”.', gesture:'a：りんごを持つつもりで、胸前から口へ運び、食べる動作をします。横へ振る動きや顎の下での停止に置き換えません。', prompt:'声かけ例：「赤くてまるいアニー。胸の前から、お口へ。音をきいて、いっしょにやってみよう。」', example:'胸前から口へ運ぶ動きを、もう一度見せたい。'},
b: {name:'Betty Broccoli', jp:'ベティ ブロッコリー', story:'ベティは、おいしい みどりの ブロッコリー。くきを つかんで、みどりの ふさを はなして、音を いってみよう。', original:'Betty Broccoli is a delicious, green vegetable. You grab her stalk and pull the green part away and say “b”.', gesture:'b：片手で茎をつかむ形を作り、もう一方の手で緑の房を引き離します。食べる・かじる動きには置き換えません。', prompt:'声かけ例：「ベティの茎をもって、緑のところをはなしてみよう。音をきいて、いっしょに。」', example:'茎を持つ手と、房を引き離す手を見やすくしたい。'},
c: {name:'Cary Cucumber', jp:'ケイリー キュウリ', story:'ケイリーは、みどりで パリッとした、夏においしい きゅうり。口に はこんで、ひとくち かじって、音を いってみよう。', original:'Cary Cucumber is green and crispy and a great summer snack. You bring him to your mouth and snap off a bite and say “c”.', gesture:'c：きゅうりを持つつもりで口へ運び、一口かじる動作をします。正本のお話に合わせ、切る動きには置き換えません。', prompt:'声かけ例：「パリッとしたケイリー。お口へはこんで、ひとくち。音をきいて、やってみよう。」', example:'口へ運んで一口かじる動作を、はっきり見せたい。'}
};
window.MEDIA_REVIEW = {
  "a": {
    "technical": "提供WAVはSHA一致・全長0.770秒。最新Aカメラ試作は12秒・3反復を新規デコード／原音配置照合済み。",
    "content": "標準には不採用。旧試作は小文字aの正本意匠と異なります。最新Aは胸前から口の高さへ動きますが、口内に薄いキャラの目・輪郭が残ります。",
    "request": "胸前→口の軌道を守り、口内のキャラの重なりをなくしてください。横振りや顎下停止に変えず、全3反復で見え方を確認してください。"
  },
  "b": {
    "technical": "提供WAVはSHA一致・全長1.020秒。既存試作は全デコード、提供音1回の配置、前後のフレームを新規確認済み。",
    "content": "標準には不採用。房を茎から離す動きは見えますが、3Dキャラの小さい口では人の調音を示せません。正本画像とは意匠も異なります。",
    "request": "正本Bettyの茎と緑の房を引き離す意味が見え、先生の口と両手を確認できる見本にしてください。"
  },
  "c": {
    "technical": "提供WAVはSHA一致・全長0.720秒。既存試作は全デコード、原音全長と動作の全反復を新規確認済み。",
    "content": "標準には不採用。口へ運ぶ動きが3回ある一方、提供音は1回だけです。先行する動きと音が対応せず、食物で口元が隠れる区間もあります。",
    "request": "正本Caryを口へ運んで一口かじる動作と、提供音1回を合わせてください。切る動きに置き換えず、口と手を見せてください。"
  }
};
