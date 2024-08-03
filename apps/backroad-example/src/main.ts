import { run } from '@backroad/backroad';

// import dotenv from 'dotenv';
// dotenv.config();
// import OpenAI from 'openai';
// import process from 'process';
// const client = new OpenAI({
//   apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
// });
// const messages = br.getOrDefault<
//     {
//       name: 'human' | 'ai';
//       content: string;
//     }[]
//   >('messages', []);

//   const chatInput = br.chatInput({
//     placeholder: 'Type here',
//   });

//   if (chatInput) {
//     messages.push({ content: chatInput, name: 'human' });
//     const chatCompletion = await client.chat.completions.create({
//       messages: messages.map((message) => ({
//         role: message.name == 'human' ? 'user' : 'assistant',
//         content: message.content,
//       })),
//       model: 'gpt-3.5-turbo',
//     });
//     chatCompletion.choices.forEach((choice) => {
//       messages.push({ content: choice.message.content || '', name: 'ai' });
//     });
//     br.setValue('messages', messages);
//   }
//   messages.forEach((message) => {
//     br.chatMessage({
//       name: message.name,
//     }).write({ body: message.content });
//   });
run(async (br) => {
  br.write({
    body: '## Calculator App',
  });
  const [col1, col2] = br.columns({ columns: 2 });
  const num1 = col1.numberInput({ label: 'Number Input 1', defaultValue: 5 });
  const num2 = col1.numberInput({ label: 'Number Input 2', defaultValue: 6 });
  const sum = num1 + num2;
  col2.write({ body: `The sum of ${num1} and ${num2} is ${sum}` });
  // col2.image({ src: './calculator.png' });
});
