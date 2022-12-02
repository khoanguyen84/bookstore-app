class Helper{
    static formatCurrency(number){
        return Number(number).toLocaleString('vi-VN', {style : 'currency', currency : 'VND'});
    }

    static getFilename(fileUrl){
        if(fileUrl){
            return fileUrl.split("/").pop().split('.')[0];
        }
        return null;
    }
}

export default Helper;