## 颜色转换插件

可以通过传入hex/rgba/rgb/hsb获取hex, rgba, hsb三种颜色 获取一个颜色透明的颜色

### ColorProcessing使用

```javascript
new ColorProcessing('#409EFF');   返回颜色处理对象
```

### ColorProcessing的方法

| 描述                             | 使用方式                                                     | 参数               |
| -------------------------------- | ------------------------------------------------------------ | ------------------ |
| 获取hex格式                      | hex()   ---   #409EFF                                        |                    |
| 获取rgba的对象                   | rgba()   ---   {r: 1, g: 2, b: 3, a: 0.5}                    |                    |
| 获取hsb的对象                    | hsb()---{h: 100, s: 200, b: 300}                             |                    |
| 获取rgb的字符串                  | rgbToString()   ---   rgb(1,2,3)                             |                    |
| 获取rgba的字符串                 | rgbaToString()   ---   rgba(1,2,3, 0.5)                      |                    |
| 获取当前颜色和要替换颜色的颜色集 | getThemeCluster(newColorProcessing)   ---   colorObj{oldColors[array], newColors[array]} | newColorProcessing |

getThemeCluster可参考demo.html中的主题切换示例