export type Successful<T> = {
  success: true;
  value: T;
};

export type Failed = {
  success: false;
  message: string;
};

export type Optional<T> = Successful<T> | Failed;

export function isSuccessful<T>(option: Optional<T>): option is Successful<T> {
  return option.success;
}

export function makeSuccessful<T>(value: T): Successful<T> {
  return { success: true, value };
}

export function makeFailed(message: string): Failed {
  return { success: false, message };
}

export function handleOption<T, S, F>(
  handleSuccess: (value: T) => S,
  handleFail: (message: string) => F
): (option: Optional<T>) => S | F {
  return (option) =>
    isSuccessful(option)
      ? handleSuccess(option.value)
      : handleFail(option.message);
}

