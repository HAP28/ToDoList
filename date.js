exports.getDate = function (){
    const today = new Date();
    
    const options = {
        weekday: "long",
        day:"numeric",
        month:"long"
    }
    return today.toLocaleDateString("hi-IN", options);
}

exports.getDay = function (){     //module.exports = exports        (shortcut)
    const today = new Date();
    
    const options = {
        weekday: "long",
    }
    return today.toLocaleDateString("hi-IN", options);
}
