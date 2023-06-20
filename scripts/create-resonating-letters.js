// const fs = require("fs");
// const path = require("path");
// const prettier = require("prettier");

// interface JsonData {
//   data: {
//     letter: string;
//     styles: {
//       margin: number[];
//       clipPath: string[];
//     };
//     textStyle: string;
//   }[];
// }

// // Read the JSON file
// fs.readFile(
//   path.resolve(__dirname, "resonating-letters.json"),
//   "utf8",
//   (err: NodeJS.ErrnoException | null, data: string | Buffer) => {
//     if (err) {
//       console.error("Error reading the file:", err);
//       return;
//     }

//     // Convert the data to a JS object
//     const jsonData: JsonData = JSON.parse(data.toString());

//     // Initialize a variable for your SCSS
//     let scssData = `
//     /* \n
//     This is an auto-generated file; direct modifications are not recommended.
//     If there are any issues or if adjustments are required, please contact dennis.wegereef@deptagency.com \n
//     */`;
//     scssData += `\n`;

//     jsonData.data.forEach((letter) => {
//       scssData += `
//         [data-resonating-letter="${letter.letter}-${letter.textStyle}"] {
//           ${letter.styles.margin
//             .map((style, index) => {
//               return `
//               &:nth-child(${index + 1}) {
//                 margin-left: ${style}em;
//                 clip-path: ${letter.styles.clipPath[index]};
//               }
//             `;
//             })
//             .join("")}
//         }
//       `;
//     });

//     // Format the SCSS string using Prettier
//     const formattedScss = prettier.format(scssData, { parser: "scss" });

//     fs.writeFile(
//       "output.scss",
//       formattedScss,
//       (err: NodeJS.ErrnoException | null) => {
//         if (err) {
//           console.error("Error writing the file:", err);
//         } else {
//           console.log("SCSS successfully written!");
//         }
//       }
//     );
//   }
// );
