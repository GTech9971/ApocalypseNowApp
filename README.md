# ApocalypseNowApp
 

## バックエンドAPIと通信

### proxy設定
なにもしていないとcross corsエラーが発生するので、package.jsonに以下を追加する

```
proxy:"バックエンドのip:port",
```

http-proxy-middlewareも試してみたが、動作しなかった。