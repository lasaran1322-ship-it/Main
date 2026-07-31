using CalculatorApp;

var calculator = new Calculator();

const double a = 12;
const double b = 4;

Console.WriteLine("CalculatorApp");
Console.WriteLine("=============");
Console.WriteLine($"{a} + {b} = {calculator.Add(a, b)}");
Console.WriteLine($"{a} - {b} = {calculator.Subtract(a, b)}");
Console.WriteLine($"{a} * {b} = {calculator.Multiply(a, b)}");
Console.WriteLine($"{a} / {b} = {calculator.Divide(a, b)}");
