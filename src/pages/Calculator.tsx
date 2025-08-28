import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MobileLayout } from "@/components/layout/MobileLayout";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? String(num) : display + num);
    }
  };

  const inputOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case "+": return firstValue + secondValue;
      case "-": return firstValue - secondValue;
      case "×": return firstValue * secondValue;
      case "÷": return firstValue / secondValue;
      case "=": return secondValue;
      default: return secondValue;
    }
  };

  const performCalculation = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  const clear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const clearEntry = () => {
    setDisplay("0");
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const percentage = () => {
    const value = parseFloat(display) / 100;
    setDisplay(String(value));
  };

  const squareRoot = () => {
    const value = Math.sqrt(parseFloat(display));
    setDisplay(String(value));
  };

  const square = () => {
    const value = Math.pow(parseFloat(display), 2);
    setDisplay(String(value));
  };

  const buttons = [
    [
      { label: "C", action: clear, className: "bg-red-500 hover:bg-red-600 text-white" },
      { label: "CE", action: clearEntry, className: "bg-orange-500 hover:bg-orange-600 text-white" },
      { label: "√", action: squareRoot, className: "bg-blue-500 hover:bg-blue-600 text-white" },
      { label: "÷", action: () => inputOperation("÷"), className: "bg-blue-500 hover:bg-blue-600 text-white" }
    ],
    [
      { label: "7", action: () => inputNumber("7") },
      { label: "8", action: () => inputNumber("8") },
      { label: "9", action: () => inputNumber("9") },
      { label: "×", action: () => inputOperation("×"), className: "bg-blue-500 hover:bg-blue-600 text-white" }
    ],
    [
      { label: "4", action: () => inputNumber("4") },
      { label: "5", action: () => inputNumber("5") },
      { label: "6", action: () => inputNumber("6") },
      { label: "-", action: () => inputOperation("-"), className: "bg-blue-500 hover:bg-blue-600 text-white" }
    ],
    [
      { label: "1", action: () => inputNumber("1") },
      { label: "2", action: () => inputNumber("2") },
      { label: "3", action: () => inputNumber("3") },
      { label: "+", action: () => inputOperation("+"), className: "bg-blue-500 hover:bg-blue-600 text-white" }
    ],
    [
      { label: "%", action: percentage, className: "bg-green-500 hover:bg-green-600 text-white" },
      { label: "0", action: () => inputNumber("0") },
      { label: ".", action: inputDecimal },
      { label: "=", action: performCalculation, className: "bg-green-500 hover:bg-green-600 text-white" }
    ],
    [
      { label: "x²", action: square, className: "bg-purple-500 hover:bg-purple-600 text-white col-span-2" },
      { label: "1/x", action: () => {
        const value = 1 / parseFloat(display);
        setDisplay(String(value));
      }, className: "bg-purple-500 hover:bg-purple-600 text-white col-span-2" }
    ]
  ];

  return (
    <MobileLayout title="Calculator">
      <div className="space-y-4 max-w-md mx-auto">
        {/* Display */}
        <Card>
          <CardContent className="p-6">
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">
                {previousValue !== null && operation ? `${previousValue} ${operation}` : ""}
              </div>
              <div className="text-3xl font-mono font-bold text-primary truncate">
                {display}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              {buttons.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-4 gap-2">
                  {row.map((button, buttonIndex) => (
                    <Button
                      key={buttonIndex}
                      onClick={button.action}
                      variant={button.className ? "default" : "outline"}
                      className={`h-12 text-lg font-semibold ${button.className || ""} ${
                        button.label === "x²" || button.label === "1/x" ? "col-span-2" : ""
                      }`}
                    >
                      {button.label}
                    </Button>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
}