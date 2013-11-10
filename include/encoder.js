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
    lastCommand : [],

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
        var argument = this.splitFromFirstSpace(introString);

        if (this.isComment(argument.action))
            return;

        if (this.isRepeat(argument.action))
            return this.repeatLastCommand(parseInt(argument.parameter));

        this.resetLastCommand();

        if (argument.action == 'DELAY')
            return this.delay(parseInt(argument.parameter));
        else if (argument.action == 'DEFAULT_DELAY')
        {
            this.defaultDelay = parseInt(argument.parameter);
            return;
        }

        if (argument.action == 'STRING')
            return this.type(argument.parameter.toString());

        if (argument.action == 'ALT-SHIFT')
            return this.pressAltShift();

        if (this.isModifier(argument.action))
            return this.pressModifierKey(argument.action, argument.parameter);

        if (this.isKeyCombo(argument.action))
            return this.pressKeyCombo(argument.action, argument.parameter);

        this.pressKey(argument.action);
        this.addZeroByte();
    },

    splitFromFirstSpace : function (command)
    {
        if (command.indexOf(' ') == -1)
            return {action: command, parameter : null};

        return {
            action: command.substr(0,command.indexOf(' ')),
            parameter: command.substr(command.indexOf(' ')+1)
        };
    },

    delay : function(delay)
    {
        if(this.verbose)
            console.log('Waiting for', delay);

        while (delay > 0) {
            this.addZeroByte();
            if (delay > 255) {
                this.addToFile(0xFF);
                delay = delay - 255;
            } else {
                this.addToFile(delay);
                delay = 0;
            }
        }
    },

    type : function(string)
    {
        if(this.verbose)
            console.log('Typing "' + string + '"');

        for (var j = 0, max = string.length; j < max ; j++)
        {
            var keys = this.layout.getCharKeys(string[j]);

            if (keys.length == 1)
                this.addToFile(keys[0]).addZeroByte();
            else if (keys.length == 2)
            {
                this.addToFile(keys[0])
                    .addToFile(keys[1]);
            }
        }
        this.applyDefaultDelay();
    },

    pressKey : function(key)
    {
        if(this.verbose)
            console.log('Pressing', key);

        this.press(key);
        this.applyDefaultDelay();
        return this;
    },

    pressModifierKey : function(key, parameter)
    {
        var keyName = this.layout.getNameOfKey(key);
        if ( ! keyName)
            throw "Unknown/unsupported key " + key;

        if(this.verbose)
        {
            if (parameter)
                console.log('Pressing combo', key, '+', parameter);
            else
                console.log('Pressing', key);
        }

        if (parameter) {
            this.press(parameter).press(key);
        } else {
            this.pressKey('LEFT_' + key).addZeroByte();
        }
        return this.applyDefaultDelay();
    },

    pressKeyCombo : function (comboKeys, parameter)
    {
        keys = comboKeys.split('-', 2);
        if (this.verbose)
            console.log('Pressing combo', comboKeys + '-' + parameter);

        this.press(parameter);
        this.addToFile(
            this.layout.getKey('MODIFIERKEY_' + keys[0])
            | this.layout.getKey('MODIFIERKEY_' + keys[1])
        );
        return this.applyDefaultDelay();
    },

    pressAltShift : function()
    {
        if (this.verbose)
            console.log('Pressing combo ALT-SHIFT');

        this.press('LEFT_ALT');
        this.addToFile(
            this.layout.getKey('MODIFIERKEY_LEFT_ALT')
                | this.layout.getKey('MODIFIERKEY_SHIFT')
        );
        return this;
    },

    press : function (keyName)
    {
        var keyValue = this.layout.getKey(keyName);
        if (keyValue)
            this.addToFile(keyValue);
        else
            throw "Unable to get value for key " + keyName;

        return this;
    },

    repeatLastCommand : function (times)
    {
        for (var i = 0; i < times ; i++)
        {
            for (var cmd = 0, count = this.lastCommand.length; cmd < count ; cmd++)
            {
                this.file.push(this.lastCommand[cmd]);
            }
            this.applyDefaultDelay();
        }
        this.resetLastCommand();
        return this;
    },

    applyDefaultDelay : function()
    {
        if (this.defaultDelay)
            this.delay(this.defaultDelay);
        return this;
    },

    addToFile : function(command)
    {
        this.file.push(command);
        this.lastCommand.push(command);
        return this;
    },

    resetLastCommand : function()
    {
        this.lastCommand = [];
    },

    isComment : function(command)
    {
        return command == 'REM'
    },

    isRepeat : function(command)
    {
        return command == 'REPEAT'
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
        this.addToFile(0x00);
        return this;
    }
}