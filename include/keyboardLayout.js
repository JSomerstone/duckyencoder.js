/**
 * Class for holding & querying keyboard layout
 * Created by jsomerstone on 11/5/13.
 */
module.exports =
{
    layout : null,
    locale : null,

    setLayout : function(layout)
    {
        this.layout = layout;
        return this;
    },

    setLocale : function(locale)
    {
        this.locale = locale;
        return this;
    },

    getCharKeys : function (char)
    {
        var code = this.charToCode(char),
            keyCodes = this.getKeysForCode(code),
            keys = [];
        if ( ! keyCodes)
        {
            console.log('Unknown character ' + char);
            return [0x00];
        }
        for(var i = 0, max = keyCodes.length; i < max ; i++)
        {
            keys[i] = this.getKey(keyCodes[i]);
        }
        return keys;
    },
    charToCode: function (char)
    {
        var c = char.toString().charCodeAt(0),
            hexCode = c.toString(16).toUpperCase();
        if(c < 128){
            return "ASCII_" + hexCode
        }else if (c < 256){
            return "ISO_8859_1_" + hexCode;
        }else{
            return "UNICODE_" + hexCode;
        }
    },

    getKeysForCode : function(code)
    {
        if (this.locale[code])
            return this.locale[code];
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
        DOWNARROW : 'KEY_DOWN',
        UPARROW : 'KEY_UP',
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