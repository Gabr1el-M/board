import { HTMLProps } from 'react';
import style from '../textarea/style.module.css';

export function Textarea({ ...rest }: HTMLProps <HTMLTextAreaElement>) {
    return <textarea className={style.textarea} {...rest} ></textarea>;
}