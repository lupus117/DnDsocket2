

function rollDie(DieSize) {
    return Math.floor(Math.random() * Math.floor(DieSize)) + 1;
}
function rollDieXtimes(number, DieSize) {
    results = [];
    for (let index = 0; index < number; index++) {
        results.push(rollDie(DieSize));
    }
    return results;
}

exports.searchAndRollDice = function (string) {
    var tmpstr = string;
    var regex = /\d+/g;
    var matches = tmpstr.match(regex);  // creates array from matches
    if (matches != null) {
        //matches.forEach(a => {console.log(a)})

        for (i = 0; i < matches.length - 1; i++) {
            dice = `${matches[i]}d${matches[i + 1]}`;
            if (tmpstr.toLowerCase().includes(dice)) {
                dierolls = rollDieXtimes(matches[i], matches[i + 1]);
                resultstring = "";
                var sum = 0;
                dierolls.forEach(element => {
                    sum += element;
                    if (resultstring != "") {
                        resultstring += ", " + element;
                    }
                    else resultstring += element;
                });
                if (i < matches.length - 2 && tmpstr.toLowerCase().includes(`${dice}+${matches[i + 2]}`)) {
                    sum += parseInt(matches[i + 2], 10);
                    dice = `${dice}+${matches[i + 2]}`;
                }
                if (i < matches.length - 2 && tmpstr.toLowerCase().includes(`${dice}-${matches[i + 2]}`)) {
                    sum -= parseInt(matches[i + 2], 10);
                    dice = `${dice}-${matches[i + 2]}`;

                }
                if (i < matches.length - 2 && tmpstr.toLowerCase().includes(`${dice}*${matches[i + 2]}`)) {
                    sum *= matches[i + 2];
                    dice = `${dice}*${matches[i + 2]}`;

                }
                if (i < matches.length - 2 && tmpstr.toLowerCase().includes(`${dice}/${matches[i + 2]}`)) {
                    sum /= matches[i + 2];
                    dice = `${dice}/${matches[i + 2]}`;

                }
                tmpstr = tmpstr.toLowerCase().replace(dice, `${sum}(${dice}=${resultstring})`)
                //console.log(`rolling: ${matches[i]}d${matches[i + 1]} = ${rollDieXtimes(matches[i], matches[i + 1])}`)

            }
        }
        //console.log("rolled:" + tmpstr);
    }

    return tmpstr;
}

////console.log(rollDie(2));
/*rollDieXtimes(5,20).forEach(die => {
    //console.log(`${die}`)
});*/