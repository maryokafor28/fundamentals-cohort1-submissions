// src/slowfunction.ts
//slow function
function fibNaive(n: number): number {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

export function heavyTask(n: number = 40): number {
  // do the heavy loop once
  let extra = 0;
  for (let i = 0; i < 5_000_000; i++) {
    extra += Math.sqrt(i) % 3; //square root
    extra += Math.pow(i, 3) % 7; //power
    extra += Math.log(i + 1) % 5; //logarithm
    extra += (i * i) % 11; //multiplication
    extra += Math.sin(i) % 2; // sine wave
    extra += Math.cos(i) % 2; // cosine wave
    extra += Math.tan(i % 100) % 2; // tangent, but limited so it doesn’t explode
    extra += Math.exp(i % 10) % 13; // exponentials
  }
  const bigArray = Array.from({ length: 50_000 }, (_, i) => ({
    id: i,
    value: Math.random() * i,
    nested: {
      a: i % 7,
      b: i % 11,
      c: "x".repeat(50),
    },
  }));
  //convert to string
  const jsonString = JSON.stringify(bigArray); //turn string to object
  const parsed = JSON.parse(jsonString); //turn back to object

  //fbonacci recurssion

  return fibNaive(n) + parsed.length + Math.floor(extra);
}
