import { GetStaticProps } from 'next';
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Image from 'next/image'
import Img from '../../public/assets/hero.png';
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

interface HomeProps {
  posts: number,
  comments: number
}


export default function Home({ posts, comments }: HomeProps) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Tarefas+ | Organize suas tarefas de forma facil</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.logoContent}>
          <Image
            className={styles.hero}
            alt="img"
            src={Img}
            priority
          />
        </div>
        <h1 className={styles.title}>Sistema feito para você organizar<br />
          seus estudos e tarefas</h1>
        <div className={styles.infoContent}>
          <section className={styles.box}>
            <span>+{posts} posts</span>
          </section>

          <section className={styles.box}>
            <span>+{comments} comentários</span>
          </section>
        </div>
      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const commentRef = collection(db, "comments")
  const postsRef = collection(db, "tarefas")

  const commentsSnapshot = await getDocs(commentRef)
  const postsSnapshot = await getDocs(postsRef)

  return {
    props: {
      posts: postsSnapshot.size || 0,
      comments: commentsSnapshot.size || 0
    },
    revalidate: 60
  }
}
