# AR-NOTE API 文档

ligen131 [i@ligen131.com](mailto:i@ligen131.com)

## 总览

Link: <https://ar-note.hust.online/api/v1>

- 1 [总览](#总览)
- 2 [Health](#health)
  - 2.1 [[GET] `/health`](#get-health)
- 3 [用户 User](#用户-user)
  - 3.1 [[GET] `/user`](#get-user)
  - 3.2 [[POST] `/user/login`](#post-userlogin)
- 4 [地点 Location](#地点-location)
  - 4.1 [[GET] `/location`](#get-location)
  - 4.2 [\*[POST] `/location/scan`](#post-locationscan)
  - 4.3 [\*[GET] `/location/list`](#get-locationlist)
- 5 [留言 Post](#留言-post)
  - 5.1 [\*[POST] `/post`](#post-post)
  - 5.2 [[GET] `/post`](#get-post)

在标题带 `*` 标识的请求中，请在请求头中提供登录获取到的 JWT token。

```yaml
Authorization: Bearer <token>
```

## Health

### [GET] `/health`

获取服务状态。

#### Request

无。

#### Response

```json
{
  "code": 200,
  "msg": null,
  "data": "ok"
}
```

## 用户 User

基本术语与约定请参见：<https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html>。

如非特殊约定，与用户相关的请求参数中只需提供 `user_id` 和 `openid` 其一即可。约定这两个参数统一称为“用户信息”。**请注意，在此处两个参数并不相同。**

- `user_id`: 用户在首次登录时后端生成的用户 ID。
- `openid`: 类似微信号，为微信用户唯一标识符（即 OpenID）。

### [GET] `/user`

通过 `user_id` 或 `openid` 获取用户基本信息。

#### Request

```json
{
  "user_id": 1,
  "openid": "wxid_xxxx"
}
```

- 用户信息：必需，需要提供 `user_id` 或 `openid` 至少一个参数。

#### Response

```json
{
  "code": 200,
  "msg": null,
  "data": {
    "user_id": 1,
    "openid": "wxid_xxxx",
    "user_name": "ligen131"
  }
}
```

- `user_name`: 用户自定义昵称。若未发送过留言，则默认值为微信昵称，否则为上一次新增留言时设置的自定义昵称。

### [POST] `/user/login`

用户通过小程序登录系统。

#### Request

```json
{
  "code": "xxxxx"
}
```

- `code`: 必需，通过调用 `wx.login()` 获取的一次性登陆凭证。

#### Response

```json
{
  "code": 200,
  "msg": null,
  "data": {
    "user_id": 1,
    "openid": "wxid_xxxx",
    "user_name": "ligen131",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxM...",
    "token_expiration_time": 1683561600
  }
}
```

- `user_name`: 用户自定义昵称。若未发送过留言，则默认值为微信昵称，否则为上一次新增留言时设置的自定义昵称。
- `token`: 登录时获取 JWT token，请在与用户权限相关的请求发送时在请求头中包含该 token。

  ```yaml
  Authorization: Bearer <token>
  ```

- `token_expiration_time`: token 过期时间，格式：Unix 时间戳。由于暂时不设置 `refresh_token` 接口，故过期时间可能会很长。

## 地点 Location

支持 AR 扫码的地点信息获取接口。

地点会事先将数据导入数据库，故不设新增与更新地点参数接口。

如非特殊约定，与地点相关的请求参数中只需提供 `location_id` 或 `location_name` 其一即可。约定这两个参数统一称为“地点信息”。

- `location_id`: 地点 ID。
- `location_name`: 地点名称。

### [GET] `/location`

获取地点信息。

#### Request

```json
{
  "location_id": 1,
  "location_name": "东九教学楼"
}
```

- 地点信息：必需，需要提供 `location_id` 或 `location_name` 至少一个参数。

#### Response

根据请求参数提供的信息返回完整地点信息。

```json
{
  "code": 200,
  "msg": null,
  "data": {
    "location_id": 1,
    "location_name": "东九教学楼"
  }
}
```

### \*[POST] `/location/scan`

用户扫某地点处小程序码，打上已扫码标记。

**该请求需要 JWT token。**

#### Request

```json
{
  "location_id": 1,
  "location_name": "东九教学楼",
  "user_id": 1,
  "openid": "wxid_xxxx"
}
```

- 地点信息：必需，需要提供 `location_id` 或 `location_name` 至少一个参数。
- 用户信息：必需，需要提供 `user_id` 或 `openid` 至少一个参数。

#### Response

```json
{
  "code": 200,
  "msg": null,
  "data": {
    "status": "ok"
  }
}
```

### \*[GET] `/location/list`

获取用户所有已扫过码的地点。

**该请求需要 JWT token。**

#### Request

```json
{
  "user_id": 1,
  "openid": "wxid_xxxx"
}
```

- 用户信息：必需，需要提供 `user_id` 或 `openid` 至少一个参数。

#### Response

```json
{
  "code": 200,
  "msg": null,
  "data": {
    "scanned_location_list": [
      {
        "location_id": 1,
        "location_name": "东九教学楼"
      },
      {
        "location_id": 2,
        "location_name": "西十二教学楼"
      }
    ]
  }
}
```

若用户没有扫过码，则会返回空 List（`[]`）。

## 留言 Post

纸条留言接口。

### \*[POST] `/post`

新增留言。

**该请求需要 JWT token。**

#### Request

```json
{
  "user_id": 1,
  "openid": "wxid_xxxx",
  "user_name": "ligen131",
  "location_id": 1,
  "location_name": "东九教学楼",
  "content": "这是一条示例留言。"
}
```

- 用户信息：必需，需要提供 `user_id` 或 `openid` 至少一个参数。
- `user_name`: 必需，用户自定义昵称，每次新增留言都会更新该用户对应的 `user_name`。同一 `user_id` 的用户的不同留言该字段可能不相同。
- 地点信息：必需，需要提供 `location_id` 或 `location_name` 至少一个参数。
- `content`: 必需，留言内容。

#### Response

```json
{
  "code": 200,
  "msg": null,
  "data": {
    "status": "留言成功！",
    "post_id": 1,
    "is_public": true
  }
}
```

- `post_id`: 留言 ID。
- `is_public`: 用户昵称和留言内容会在后端进行内容审查，若审查不通过则此项为 `false`，但**依旧返回留言成功信息**。前端可根据该字段决定是否将其展示在用户纸条广场。

后端会检测用户是否有该地点留言权限。若用户未在该地点扫过码，则按照以下格式返回错误信息。

```json
{
  "code": 403,
  "msg": "Forbidden",
  "data": {
    "status": "抱歉，您尚未前往该地点扫码，留言失败。"
  }
}
```

### [GET] `/post`

获取留言列表。

**该请求在一部分情况下需要 JWT token。**

#### Request

```json
{
  "user_id": 1,
  "openid": "wxid_xxxx",
  "location_id": 1,
  "location_name": "东九教学楼",
  "limit": 20,
  "order_by": "time",
  "start_time": 1683561600,
  "is_include_recent_post": true
}
```

- 用户信息：**非必需**，若提供则需要提供 `user_id` 或 `openid` 至少一个参数。若提供则会根据用户信息进行筛选，且会返回 `is_public` 为 `false` 的留言。若不提供，则不会返回 `is_public` 为 `false` 的留言。
- 地点信息：**非必需**，若提供则需要提供 `location_id` 或 `location_name` 至少一个参数。若提供则会根据地点信息进行筛选。
- `limit`: 非必需，限制返回留言上限，若未提供或提供值非法则默认为 20 条。
- `order_by`: 非必需，留言排序方式，有以下可选值：
  - `time`: 按时间倒序排序。
  - `random`: 随机返回留言。为了留言广场中每次刷新展示的留言都尽可能不一样，若提供该值，则**请尽量提供 JWT token**。若未提供 `order_by` 值或提供的值非法，则以该值为默认值。
- `start_time`: 非必需，限定获取该时间及以前的留言，若未提供则以请求时间为默认值。
- `is_include_recent_post`: 非必需，在用户信息被提供时生效，是否包含最近一条该用户发送的留言，默认为 `false`。若此项为 `true` 则忽略 `order_by` 和 `start_time` 的限制条件，`is_public` 为 `false` 的留言也会返回，但仍在 `limit` 限制中。

#### Response

```json
{
  "code": 200,
  "msg": null,
  "data": {
    "post_list": [
      {
        "user_id": 1,
        "openid": "wxid_xxxx",
        "user_name": "ligen131",
        "location_id": 1,
        "location_name": "东九教学楼",
        "post_id": 1,
        "time": 1683561600,
        "content": "这是一条示例留言。",
        "is_public": true
      },
      {
        "user_id": 1,
        "openid": "wxid_xxxx",
        "user_name": "ligen131",
        "location_id": 2,
        "location_name": "西十二教学楼",
        "post_id": 2,
        "time": 1683561601,
        "content": "这是一条无法通过审查的留言示例，仅用户本人可见。",
        "is_public": false
      }
    ]
  }
}
```

- `user_name`: 用户自定义昵称，同一 `user_id` 的用户的不同留言该字段可能不相同。
