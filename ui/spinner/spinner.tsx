import React, { FC } from "react";
import s from "./spinner.module.css";

export enum TargetType {
  loading,
  reqWaiting
}

interface LoadingSpinnerProps {
  target: TargetType
}

const LoadingSpinner:FC<LoadingSpinnerProps> = ({ target }) => {
  const size = target == TargetType.loading ? 1 : 0.5

  const someStyle: any = {
    "--width": `${size * 50}px`,
    "--height": `${size * 50}px`,
    "--border": `${size * 10}px`,
    "--border-top": `${size * 10}px`,
    "--s": `${size}s`,
    "--position": `${ target == TargetType.loading ? "absolute" : "inherit"}`,
  }

  return (
    <div className={s["spinner-container"]}>
      <div className={s["loading-spinner"]} style={someStyle}>
      </div>
    </div>
  );
}

export default LoadingSpinner;