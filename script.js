const inputSlider = document.querySelector("[data-length-slider]");
const lengthDisplay  = document.querySelector("[data-length-number]");
const passwordDisplay = document.querySelector("[data-password]");
const CopyBtn = document.querySelector("[data-copy]");
const copyMessage = document.querySelector("[data-copy-message]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbol");

const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const para = document.querySelector("#indi-para");

const Symbols = '~!@#$%^{}[]&*()_+|?><:":;,.';

let password = "";
let passwordLen = 10;
let checkCount = 1;

handleSlider();
setIndicator("#ccc");

// ye sirf slider ki ui ko change karta hai
function handleSlider(){
    inputSlider.value = passwordLen;
    lengthDisplay.innerText = passwordLen;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLen - min) *100/(max-min)) +"% 100%";
    
}

function setIndicator(color){
       indicator.style.backgroundColor = color;
       indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
    
}


function GetRndInterger(min, max){
    return Math.floor(Math.random() * (max-min)) +min;
}
function generateRndNumber(){
  return GetRndInterger(0,9);
}


function generateLowerCase(){
    return String.fromCharCode(GetRndInterger(97,123));
    
}
function generateUpperCase(){
    return String.fromCharCode(GetRndInterger(65,91));
    
}

function generateSymbol(){
    const randomIdx = GetRndInterger(0, Symbols.length);
    return Symbols.charAt(randomIdx);
}


function calStength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolCheck.checked)  hasSym = true;

    if(hasUpper && hasLower && hasSym && hasNum && passwordLen >= 8){
        setIndicator("#0f8");

        para.innerText = "Super Strong";
        
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLen >=6){
        setIndicator("#ff0");
        para.innerText = "Strong";
      
    }
    else if((hasLower || hasUpper) && (hasNum || hasSym) && password >=4){
        setIndicator("#ff0");
        para.innerText = "Good";
    }
    else{
        setIndicator("#f00");
        para.innerText = "Week";
    }
}



async function Copy(){
   try{
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMessage.innerText = "Copied";
    copyMessage.classList.add("active");
   }

   catch(e){
     copyMessage.innerText = "Failed";
   }

   

   setTimeout(() => {
    copyMessage.classList.remove("active");
   }, 1000);
};

function sufflePassword(array){
    //Fisher Yates Method
    for(let i=array.length-1; i>0; i--){
        const j = Math.floor(Math.random()* (i +1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    } 
    let str = "";
    array.forEach((el) => (str +=el));
    return str;
};

function handlecheckbox(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked){
            checkCount++;
        }
    });

    //Cornor case yadi password ki length choti h count se to 
    if(passwordLen < checkCount){
     passwordLen = checkCount;
     handleSlider();
    }

}
allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change', handlecheckbox);
});


inputSlider.addEventListener('input',(e) =>{
    passwordLen = e.target.value;
    handleSlider();
});

CopyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value){
        Copy();
    }
});

generateBtn.addEventListener('click',() =>{
     //none of the checkbox are selected
     if(checkCount == 0){
        return;
     }
     if(passwordLen < checkCount){
        passwordLen = checkCount;
        handleSlider();
     }

     //lets find our password
     

    //  remove old password
    password = "";

    //check karo kon kon se checkbox check hai
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += generateRndNumber();
    // }
    // if(symbolCheck.checked){
    //     password += generateSymbol();
    // }

    let funArr = [];

    if(uppercaseCheck.checked)
        funArr.push(generateUpperCase); 
    
    if(lowercaseCheck.checked)
        funArr.push(generateLowerCase); 
    
    if(numbersCheck.checked)
        funArr.push(generateRndNumber); 
    
    if(symbolCheck.checked)
        funArr.push(generateSymbol);

    //Compulsory Addition
    for(let i=0; i<funArr.length; i++){
          password +=  funArr[i]();
    }
    console.log("compulsory addition is Done")

    for(let i=0; i<passwordLen-funArr.length; i++){
           let randomIdx = GetRndInterger(0, funArr.length);
           console.log("randomIdx" + randomIdx);
           password += funArr[randomIdx]();
    }

    console.log("remaining Addition Done");
    // shuffle the password
    password = sufflePassword(Array.from(password));

    //show the password
    passwordDisplay.value = password;
    calStength();
});