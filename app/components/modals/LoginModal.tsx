'use client';

import { signIn } from 'next-auth/react';
import axios from 'axios';
import { AiFillGithub } from "react-icons/ai";
import { SiFacebook } from "react-icons/si";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from 'react';
import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';

import useRegisterModal from '@/app/hooks/useRegisterModal';
import useLoginModal from '@/app/hooks/useLoginModal';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import toast from 'react-hot-toast';
import Button from '../Button';
import { useRouter } from 'next/navigation';

const LoginModal = () => {
    const router = useRouter();
    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        signIn('credentials', {
            ...data,
            redirect: false,
        })
        .then((callback) => {
            setIsLoading(false);

            if (callback?.ok) {
                toast.success('Logged In');
                router.refresh();
                loginModal.onClose();
            }

            if (callback?.error) {
                toast.error(callback.error);
            }
        })
    }

    const toggle = useCallback(() => {
        loginModal.onClose();
        registerModal.onOpen();
    }, [loginModal, registerModal]);

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading 
                title="Shayne's B&B"
                subtitle="Login to your Account"
            />
            <Input 
                id="email"
                type="email"
                label="Email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input 
                id="password"
                type="password"
                label="Password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    );

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <Button 
                outline
                label="Log in with Google"
                icon={FcGoogle}
                onClick={() =>signIn('google')}
            />
            {/* <Button 
                outline
                label="Sign-up with Facebook"
                icon={SiFacebook}
                onClick={() =>{}}
            /> */}
            <Button 
                outline
                label="Log-in with Github"
                icon={AiFillGithub}
                onClick={() =>signIn('github')}
            />
            <div 
                className="
                    text-neutral-500
                    text-center
                    mt-4
                    font-light
                "
            >
                <div className="
                    justify-enter flex flex-row items-center gap-2">
                    <div>Are You New Here?</div>
                    <div
                        onClick={toggle}
                        className="
                            text-fuchsia-800
                            cursor-pointer
                            hover:underline
                        ">
                        Create an Account
                    </div>
                </div> 

            </div>
        </div>
    )

    return (
       <Modal 
            disabled={isLoading}
            isOpen={loginModal.isOpen}
            title="LogIn"
            actionLabel="Continue"
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
       />
    );
}

export default LoginModal;