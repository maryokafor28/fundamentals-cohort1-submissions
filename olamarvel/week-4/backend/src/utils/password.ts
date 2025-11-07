import bcrypt from "bcrypt";

const saltRounds = 10;

export function hash(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err: Error | undefined, hash: string) {
      if (err) return reject(err);
      resolve(hash);
    });
  });
}

export function compare(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err: Error | undefined, result: boolean) {
      if (err) return reject(err);
      resolve(result);
    });
  });
}
