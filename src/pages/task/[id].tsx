import { ChangeEvent, FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import Head from "next/head";
import style from './style.module.css';
import { db } from "@/src/services/firebaseConnection";
import {
    collection,
    query,
    where,
    doc,
    getDoc,
    addDoc,
    getDocs,
    deleteDoc,
} from 'firebase/firestore';
import { Textarea } from "@/src/components/textarea";
import { FaTrash } from 'react-icons/fa';

interface TaskProps {
    item: {
        tarefa: string;
        public: string;
        created: boolean;
        user: string;
        taskId: string;
    };
    allComments: CommentsProps[];
}

interface CommentsProps {
    id: string,
    comment: string,
    taskId: string,
    user: string,
    name: string
}

export default function Task({ item, allComments }: TaskProps) {

    const { data: session } = useSession();
    const [ input, setInput ] = useState("");
    const [ comments, setComments ] = useState<CommentsProps[]>(allComments || []);

    async function handleComent(event: FormEvent) {
        event.preventDefault();
        if(input === "") return;

        if(!session?.user?.email || !session?.user.name) return;

        try {
            const docRef = await addDoc(collection(db, "comments"), {
                comment: input,
                created: new Date(),
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: item?.taskId
            });

            const data = {
                id: docRef.id,
                comment: input,
                user: session?.user?.email,
                name: session?.user?.name,
                taskId: item.taskId
            }

            setComments((oldItem) => [...oldItem, data])
            setInput("");
        } catch(err) {
            console.log(err)
        }
    }

    async function handleDeleteComment(id: string) {
        try{
         const docRef = doc(db, "comments", id);
         await deleteDoc(docRef);
         
         const deleteComents = comments.filter((item) => item.id !== id)
         setComments(deleteComents);
        }catch(err) {
            console.log(err);
        }
    }

    return (
        <div className={style.container}>
            <Head>
              <title>Detalhes da tarefa</title>
            </Head>

            <main className={style.main}>
                <h1>Tarefa</h1>
                <article className={style.task}>
                    <p>
                      {item.tarefa}
                    </p>
                </article>
            </main>
            <section className={style.commentsContainer}>
                <h2>Deixar comentário</h2>

                <form onSubmit={handleComent}>
                    <Textarea
                    value={input}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setInput(event.target.value)}
                    placeholder="Digite seu comentário..."
                    />
                    <button disabled={!session?.user} className={style.button}>Enviar comentário</button>
                </form>
            </section>
            <section className={style.commentsContainer}>
                <h2>Todos os comentários</h2>

                {comments.length === 0 && (
                    <span>Nenhum comentário foi encontrado...</span>
                )}

                {comments.map((item) => (
                    <article key={item.id} className={style.comment}>
                        <div className={style.headComment}>
                            <label className={style.commentsLabel}>{item.name}</label>
                           {item.user === session?.user?.email && (
                             <button className={style.buttonTrash} onClick={() => handleDeleteComment(item.id)}>
                             <FaTrash
                             size={18}
                             color="#ea3140"
                             />
                         </button>
                           )}
                        </div>
                        <p>{item.comment}</p>
                    </article>
                ))}
            </section>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const id = params?.id as string;
    const docRef = doc(db, "tarefas", id);

    const q = query(collection(db, "comments"),  where("taskId", "==", id));
    const snapshotComments = await getDocs(q);

    let allComments: CommentsProps[] = [];
    snapshotComments.forEach((doc) => {
        allComments.push({
            id: doc.id,
            comment: doc.data().comment,
            user: doc.data().user,
            name: doc.data().name,
            taskId: doc.data().taskId
        })
    })

    const snapshot = await getDoc(docRef);

    if(snapshot.data() === undefined) {
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }
    
    if(!snapshot.data()?.public){
        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    const miliseconds = snapshot.data()?.created?.seconds * 1000;
    const task = {
        tarefa: snapshot.data()?.tarefa,
        public: snapshot.data()?.public,
        created: new Date(miliseconds).toLocaleDateString(),
        user: snapshot.data()?.user,
        taskId: id,
    }

    return {
        props: {
            item: task,
            allComments: allComments,
        }
    }

}