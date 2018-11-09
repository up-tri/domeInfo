<?php
    /**
     * 東京ドームのイベント情報を公式サイトのシステムから取得し、Twitterに投稿する
     *
     * cronジョブで任意の日時に稼働させると吉。
     *
     * @since 2018.05.04
     *
     * @author up-tri
     */

    require "vendor/autoload.php";
    // .env ライブラリ
    use Dotenv\Dotenv;
    // Twitter API ライブラリ
    use Abraham\TwitterOAuth\TwitterOAuth;

    // 環境設定ファイルの読み込み
    $dotenv = new Dotenv(__DIR__);
    $dotenv->load(); //.envが無いとエラーになる

    // Twitter OAuth情報
    define(CONSUMER_KEY, getenv('CONSUMER_KEY'));
    define(CONSUMER_SECRET, getenv('CONSUMER_SECRET'));
    $access_token = getenv('ACCESSS_TOKEN');
    $access_token_secret = getenv('ACCESS_TOKEN_SECRET');

    // TDSの公式サイト上にあるjsonを取得
    $json = file_get_contents("https://www.tokyo-dome.co.jp/resources/events.json");
    $arr = json_decode($json);
    // カテゴリの対応表
    $cats = [
        'TDC'                => '東京ドームシティ',
        'TokyoDome'          => '東京ドーム',
        'at_raku'            => 'アトラクションズ',
        'at_raku_hero'       => 'ヒーローショー',
        'ASOBono'            => 'アソボ～ノ！',
        'GO-FUN'             => 'GO-FUN',
        'bowling'            => 'ボウリング',
        'roller'             => 'ローラースケート',
        'spo-dori'           => 'スポドリ！',
        'tenq'               => 'TeNQ',
        'aamo'               => 'Gallery AaMo',
        'laqua_shops'        => 'ラクーア',
        'laqua_garden_stage' => 'ラクーア',
        'laqua_spa'          => 'スパ ラクーア',
        'meetsport'          => 'ミーツポート',
        'tdc-hall'           => 'TDC HALL',
        'korakuen-hall'      => '後楽園ホール',
        'prism-hall'         => 'プリズムホール',
        'g-rosso'            => 'シアターＧロッソ',
        'TokyoDome-Hotels'   => '東京ドームホテル',
        'baseball-museum'    => '野球殿堂博物館',
        'wins'               => 'ウインズ後楽園',
        'offt'               => 'オフト後楽園',
        'gourmet'            => 'グルメ',
        'shopping'           => 'ショップ'
    ];

    // その日にイベントがあるかどうか
    $has_event = false;
    // イベントタイトル
    $title = "";
    // 開閉時間情報
    $time_info = "";

    $len = count($arr);
    for ($i = 0; $i < $len; $i++) {
        $ev = $arr[$i];
        // 全イベント情報のうち、東京ドームでの情報に絞る
        if (in_array('TokyoDome', $ev->category)) {
            $dates = explode(",", $ev->dates);
            // イベント情報があれば
            if (in_array(date('Ymd'), $dates)) {
                $has_event = true;
                $title = $ev->title;
                $time_info = ($ev->opening_time !== "" ? '開場...' . $ev->opening_time : $ev->open_time);
                break;
            }
        }
    }

    // Twitter APIへコネクションを張る
    $connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token, $access_token_secret);
    if ($has_event) {
        $content = $connection->post("statuses/update", ["status" => '[' . date('Y年m月d日') . "の東京ドームイベント情報]\n" . $ev->title . "\n" . ($ev->opening_time !== "" ? '開場...' . $ev->opening_time : $ev->open_time) . "\n\n(" . date('H時i分s秒 時点') . ")"]);
    } else {
        $content = $connection->post("statuses/update", ["status" => '[' . date('Y年m月d日') . "の東京ドームイベント情報]\nイベントはありません。" . "\n\n(" . date('H時i分s秒 時点') . ")"]);
    }
