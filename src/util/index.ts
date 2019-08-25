export function after(fn: Function, aftFn: Function) {
    const res = fn.apply(this, arguments);
    return function() {
        return !res ? aftFn.apply(this, arguments) : res;
    };
};

/**
 *
 * @param img html的img标签
 * @param ext 图片格式
 * @returns {string}
 */
export function getImageBase64(img, ext) {
    let canvas = document.createElement("canvas");   //创建canvas DOM元素，并设置其宽高和图片一样
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height); //使用画布画图
    const dataURL = canvas.toDataURL("image/" + ext);  //返回的是一串Base64编码的URL并指定格式
    canvas = null; //释放
    return dataURL;
}

