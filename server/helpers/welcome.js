const welcomeHtml = `
    <style>
        * {
            margin: 0;
            padding: 0;
        }
        body {
            height: 100vh; 
            display: flex; 
            justify-content: center; 
            align-items: center;
            font-family: 'Open Sans', sans-serif;
            flex-direction: column;
            font-size: 16px;
        }
        .container {
            text-align: center;
        }
        h1 {
            font-weight: 100;                  
        }
        .subtitle {
            line-height: 1.2;            
        }
        .copyright {
            font-size: .8em;
            margin-top: 4px;
        }
        .version, .donate, .donate-address {
            font-size: .8em;
            margin-top: 4px;
            color: #000;
        }
        .donate {
            margin-top: 10px;
            color: #6a6a6a;
        }
        .donate-address {
            font-weight: bold;
            color: #000;
            cursor: pointer;
        }
        hr {
            background: #ececec;
            height: 1px;
            border: none;
            margin-top: 10px;
        }
        .mina-version-wrapper {
            margin-top: 10px;
            border: 1px solid #ececec;
            padding: 8px 16px;
            background: #8185dc;
            color: #fff;
        }
        .mina-version {
            font-weight: bold;
        }
    </style>
    <body>
        <div class="container">
            <h1>Welcome to Mina Monitor!</h1>    
            <p class="subtitle">CONVENIENT MONITORING OF YOUR MINA NODES!</p>     
            <p class="copyright">Copyright 2021 by <a href="https://pimenov.com.ua">Serhii Pimenov</a></p>
            <p class="version">Mina Monitor v%VER%</p>
            <p class="donate">--= You can donate Mina to address =--</p>
            <p class="donate-address" title="Click to copy to clipboard">B62qqQjC8zaU8XXaeqb9rZXFSX9x12mCgjrdCQuJbXuxU2KUPFcH7aY</p>
            
            <p class="mina-version-wrapper"><small>MINA: </small> <span class="mina-version">%MINA%</span></p>    

        </div>
        <script>
            const donateAddress = document.querySelector(".donate-address")
            donateAddress.addEventListener("click", () => {
                navigator.clipboard.writeText(donateAddress.innerText)
            })
        </script>       
    </body>
`

module.exports = {
    welcomeHtml
}