/**
 * Created by jsomerstone on 11/5/13.
 *
 */
module.exports =
{
    instructions : null,
    file : [],
    verbose : false,
    layout : null,

    setLayout : function(layout)
    {
        this.layout = layout
        return this;
    },

    read : function(duckyScript)
    {
        this.instructions = duckyScript.split("\n");
        this.file = [];
        return this;
    },

    parse: function()
    {
        if (!this.layout)
            throw "Keyboard layout must be set with encoder.setLayout()";

        for (var i = 0, max = this.instructions.length; i < max; i++)
        {
            if (this.instructions[i])
                this.readInstructions(this.instructions[i]);
        }
        return this;
    },

    getFile : function()
    {
        return new Buffer(this.file);
    },

    readInstructions : function(introString)
    {
        var splitted = introString.split(' ', 2),
            command = null,
            parameter = null;

        if (splitted[0])
            command = splitted[0];
        if (splitted[1])
            parameter = splitted[1];

        if (this.isComment(command))
            return;

        if (command == 'DELAY')
            return this.delay(parseInt(parameter));

        if (command == 'STRING')
            return this.type(parameter.toString());

        if (command == 'ALT-SHIFT')
            return this.pressAltShift();

        if (this.isModifier(command))
            return this.pressModifierKey(command, parameter);

        if (this.isKeyCombo(command))
            return this.pressKeyCombo(command, parameter);

        this.pressKey(command);
        this.addZeroByte();
    },

    delay : function(delay)
    {
        if(this.verbose)
            console.log('Waiting for', delay);

        while (delay > 0) {
            this.addZeroByte();
            if (delay > 255) {
                this.file.push(0xFF);
                delay = delay - 255;
            } else {
                this.file.push(delay);
                delay = 0;
            }
        }
    },

    type : function(typing)
    {
        if(this.verbose)
            console.log('Typing "' + typing + '"');

        for (j = 0, max = typing.length; j < max ; j++)
        {
            this.press(typing[j]).addZeroByte();
        }
    },

    pressKey : function(key)
    {
        if(this.verbose)
            console.log('Pressing', key);

        this.press('KEY_' + key);
        return this;
    },

    pressModifierKey : function(key, parameter)
    {
        if(this.verbose)
        {
            if (parameter)
                console.log('Pressing combo', key, '+', parameter);
            else
                console.log('Pressing', key);
        }

        if (parameter) {
            return this.press(parameter).press(key);
        } else {
            return this.pressKey('LEFT_' + key).addZeroByte();
        }
    },

    pressKeyCombo : function (comboKeys, parameter)
    {
        keys = comboKeys.split('-', 2);
        if (this.verbose)
            console.log('Pressing combo', comboKeys + '-' + parameter);

        this.press(parameter);
        this.file.push(
            this.layout.getKey('MODIFIERKEY_' + keys[0])
            | this.layout.getKey('MODIFIERKEY_' + keys[1])
        );
        return this;
    },

    pressAltShift : function()
    {
        if (this.verbose)
            console.log('Pressing combo ALT-SHIFT');

        this.press('LEFT_ALT');
        this.file.push(
            this.layout.getKey('MODIFIERKEY_LEFT_ALT')
                | this.layout.getKey('MODIFIERKEY_SHIFT')
        );
        return this;
    },

    press : function (keyName)
    {
        var keyValue = this.layout.getKey(keyName.trim().toUpperCase());
        if (keyValue)
            this.file.push(this.layout.getKey(keyName));

        return this;
    },

    isComment : function(command)
    {
        return command == 'REM'
    },

    isModifier : function(command)
    {
        return [
            'GUI',
            'WINDOWS',
            'CONTROL',
            'CTRL',
            'ALT',
            'SHIFT'
        ].indexOf(command) != -1;
    },

    isKeyCombo : function(command)
    {
        return [
            'CTRL-ALT',
            'CTRL-SHIFT',
        ].indexOf(command) != -1;
    },

    addZeroByte : function()
    {
        this.file.push(0x00);
        return this;
    }
}