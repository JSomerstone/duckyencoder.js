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
        var ucKey = key.trim().toUpperCase();
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
        var ucKey = key.toUpperCase();
        if (this.layout['KEY_' + ucKey])
            return 'KEY_' + ucKey;
        if (this.layout['MODIFIERKEY_' + ucKey])
            return 'MODIFIERKEY_' + ucKey;
        if (this.keyAliases[ucKey])
            return this.keyAliases[ucKey];

        return null;
    },

    keyAliases : {
        //Alias : NAME_OF_KEY
        ESCAPE : 'KEY_ESC',
        DEL : 'KEY_DELETE',
        CONTROL : 'MODIFIERKEY_CTRL',
        CTRL : 'MODIFIERKEY_CTRL',
        ALT : 'MODIFIERKEY_ALT',
        SHIFT : 'MODIFIERKEY_SHIFT',
        DOWN : 'KEY_DOWN',
        UP : 'KEY_UP',
        LEFTARROW : 'KEY_LEFT',
        RIGHTARROW : 'KEY_RIGHT',
        MENU : 'KEY_APP',
        WINDOWS : 'MODIFIERKEY_GUI',
        GUI : 'MODIFIERKEY_GUI',
        PLAY : 'KEY_MEDIA_PLAY_PAUSE',
        PAUSE : 'KEY_MEDIA_PLAY_PAUSE',
        STOP : 'KEY_MEDIA_STOP',
        MUTE : 'KEY_MEDIA_MUTE',
        VOLUMEUP : 'KEY_MEDIA_VOLUME_INC',
        VOLUMEDOWN : 'KEY_MEDIA_VOLUME_DEC',
        EJECT : 'KEY_MEDIA_EJECT',
        SCROLLLOCK : 'KEY_SCROLL_LOCK',
        NUMLOCK : 'KEY_NUM_LOCK',
        CAPSLOCK : 'KEY_CAPS_LOCK'
    }
}