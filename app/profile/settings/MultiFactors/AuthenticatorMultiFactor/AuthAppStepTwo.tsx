// interface Props {
//   nextHandler: (step: number) => void;
// }

// const AuthAppStepTwo = ({ nextHandler }: Props) => {
//     const { control, getValues } = useForm();
//     const { close } = useModal();
//     const { userInfo } = useAuth();
//     const [isLoading, setIsLoading] = useState(false);

//   return (
//     <div>
//       <div>
//         <button
//           type="button"
//           onClick={close}
//           className="text-blue-600 hover:text-gray-500 duration-300 mr-4"
//         >
//           Cancel
//         </button>
//         <button
//           disabled={isLoading}
//           className="text-blue-600 disabled:text-gray-500 hover:text-gray-500 duration-300 disabled:cursor-not-allowed"
//           onClick={async () => {
//             setIsLoading(true);

//             const generateService = new APIClient(
//               `/users/${userInfo?.user._id}/two-step-verification/email/verify`
//             );

//             const res = await generateService.post({
//               code: getValues("code"),
//               email,
//             });

//             if (res.error) {
//               setIsLoading(false);
//               return toast.error("Failed to verify", {
//                 description: res.error.message,
//                 position: "top-center",
//               });
//             }

//             if (res.verified) {
//               toast.success("Code verified", {
//                 position: "top-center",
//               });
//               setIsLoading(false);
//               nextHandler(2);
//               close();
//             } else {
//               toast.error("Failed to verify code", {
//                 description: "Is either the code has expired or it's incorrect",
//                 position: "top-center",
//               });
//               setIsLoading(false);
//             }
//           }}
//         >
//           {isLoading ? "Verifying..." : "Verify"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AuthAppStepTwo;
