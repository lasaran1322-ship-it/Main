using CalculatorApp;
using Xunit;

namespace CalculatorApp.Tests;

public class CalculatorTests
{
    private readonly Calculator _calculator = new();

    [Theory]
    [InlineData(2, 3, 5)]
    [InlineData(-1, 1, 0)]
    [InlineData(0, 0, 0)]
    [InlineData(-4, -6, -10)]
    public void Add_ReturnsSum(double a, double b, double expected)
    {
        Assert.Equal(expected, _calculator.Add(a, b));
    }

    [Theory]
    [InlineData(5, 3, 2)]
    [InlineData(0, 5, -5)]
    [InlineData(-2, -3, 1)]
    public void Subtract_ReturnsDifference(double a, double b, double expected)
    {
        Assert.Equal(expected, _calculator.Subtract(a, b));
    }

    [Theory]
    [InlineData(4, 3, 12)]
    [InlineData(-2, 5, -10)]
    [InlineData(0, 100, 0)]
    public void Multiply_ReturnsProduct(double a, double b, double expected)
    {
        Assert.Equal(expected, _calculator.Multiply(a, b));
    }

    [Theory]
    [InlineData(10, 2, 5)]
    [InlineData(9, 3, 3)]
    [InlineData(-8, 4, -2)]
    public void Divide_ReturnsQuotient(double a, double b, double expected)
    {
        Assert.Equal(expected, _calculator.Divide(a, b));
    }

    [Fact]
    public void Divide_ByZero_ThrowsDivideByZeroException()
    {
        Assert.Throws<DivideByZeroException>(() => _calculator.Divide(1, 0));
    }
}
