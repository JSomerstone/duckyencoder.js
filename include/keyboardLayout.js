/**
 * Class for holding & querying keyboard layout
 * Created by jsomerstone on 11/5/13.
 */
module.exports =
{
    layout : null,

    setLayout : function(layout)
    {
        this.layout = layout;
    },

    getKey : function(key)
    {
        var ucKey = key.toUpperCase();
        if (this.layout[ucKey])
        {
            return this.keyToByte(this.layout[ucKey]);
        }
        else if (this.layout['KEY_' + ucKey])
        {
            return this.keyToByte(this.layout['KEY_' + ucKey]);
        }
        else if(this.getNameOfKey(ucKey))
        {
            return this.getKey(this.getNameOfKey(ucKey));
        }

        return null;
    },

    keyToByte : function (keyValue)
    {
        if (typeof keyValue == 'number')
            return parseInt(keyValue);
        if (typeof keyValue == 'string')
            return this.strToByte(keyValue);
    },

    strToByte : function (str) {
        if(str.indexOf("0x") == 0){
            return parseInt(str.substring(2),16);
        }else{
            return parseInt(str);
        }
    },

    getNameOfKey : function (key)
    {
        if (this.keyMapping[key.toUpperCase()])
            return 'KEY_' + this.keyMapping[key];

        return null;
    },

    keyMapping : {
        //Key : 'KEY_'+NAME index in layout
        ESCAPE : 'ESC',
        DEL : 'DELETE',
        CONTROL : 'CTRL',
        DOWN : 'DOWNARROW',
        UP : 'UPARROW',
        LEFTARROW : 'LEFT',
        RIGHTARROW : 'RIGHT',
        MENU : 'APP',
        WINDOWS : 'GUI',
        PLAY : 'MEDIA_PLAY_PAUSE',
        PAUSE : 'MEDIA_PLAY_PAUSE',
        STOP : 'MEDIA_STOP',
        MUTE : 'MEDIA_MUTE',
        VOLUMEUP : 'MEDIA_VOLUME_INC',
        VOLUMEDOWN : 'MEDIA_VOLUME_DEC',
        SCROLLLOCK : 'SCROLL_LOCK',
        NUMLOCK : 'NUM_LOCK',
        CAPSLOCK : 'CAPS_LOCK'
    }
}