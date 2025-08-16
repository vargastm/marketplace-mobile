import { router } from 'expo-router'
import { useState } from 'react'
import {
  Center,
  Heading,
  ScrollView,
  Text,
  useToast,
  VStack,
} from '@gluestack-ui/themed'
import Logo from '@assets/logo.svg'
import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { ToastMessage } from '@components/ToastMessage'
import { useAuth } from '@hooks/useAuth'
import { AppError } from '@utils/AppError'
import { Mail, KeyRound, MoveRight } from 'lucide-react-native'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

const signInFormSchema = z.object({
  email: z
    .string({
      required_error: 'Please enter your email',
    })
    .email('Invalid email'),
  password: z
    .string({
      required_error: 'Please enter your password',
    })
    .min(1, 'Please enter your password'),
})

type SignInForm = z.infer<typeof signInFormSchema>

export default function SignInScreen() {
  const [isLoading, setIsLoading] = useState(false)

  const { signIn } = useAuth()

  const toast = useToast()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({ resolver: zodResolver(signInFormSchema) })

  async function handleSignIn({ email, password }: SignInForm) {
    try {
      setIsLoading(true)

      await signIn(email, password)
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError
        ? error.message
        : 'Unable to sign in. Please try again later.'

      toast.show({
        placement: 'top',
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title={title}
            onClose={() => toast.close(id)}
          />
        ),
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleSignUp() {
    router.navigate('/auth/sign-up')
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} width={'$full'} bg="$white">
        <Center my="$16" gap={'$8'}>
          <Logo width={64} height={48} />

          <Center gap={'$1'}>
            <Heading color="$gray500" fontSize="$title_lg">
              Sign in to your account
            </Heading>

            <Text
              color="$gray300"
              fontSize={'$body_sm'}
              lineHeight={'$body_sm'}
            >
              Enter your email and password to log in
            </Text>
          </Center>
        </Center>

        <VStack flex={1} px={'$10'} gap={'$10'}>
          <Center gap="$5">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <Input
                  variant="underlined"
                  label="Email"
                  icon={Mail}
                  placeholder="mail@example.com"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.email?.message}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <Input
                  variant="underlined"
                  label="Password"
                  type="password"
                  icon={KeyRound}
                  placeholder="Your password"
                  onChangeText={onChange}
                  value={value}
                  errorMessage={errors.password?.message}
                  onSubmitEditing={handleSubmit(handleSignIn)}
                  returnKeyType="send"
                />
              )}
            />
          </Center>

          <Button
            title="Sign In"
            icon={MoveRight}
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
          />
        </VStack>

        <VStack
          flex={1}
          px={'$10'}
          gap={20}
          justifyContent="flex-end"
          marginTop={80}
          marginBottom="$10"
        >
          <Text color="$gray300" fontSize={'$body_md'}>
            Don't have an account yet?
          </Text>

          <Button
            title="Sign Up"
            icon={MoveRight}
            variant="outline"
            onPress={handleSignUp}
          />
        </VStack>
      </VStack>
    </ScrollView>
  )
}
