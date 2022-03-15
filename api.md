###  1、删除活动列表

 ##### 请求url:

```
url: {{bash}}/api/active/delActive
method: put
```

#### 参数类型：body

| 参数   | 是否必选 | 类型     | 说明                   |
| ---- | ---- | ------ | -------------------- |
| id   | true | string | 被改变状态文章id            |
| type | true | string | 1：校园资讯，2:活动信息，5:作为文章 |

#### 返回示例

```
{
	success:true,
	data:{
  		type:'5',
  		id:"1325423"
	}
}
```

