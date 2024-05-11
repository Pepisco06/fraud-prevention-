import User from "@/app/libs/models/User";
import { AuthenticatorDocument } from "@/app/libs/models/mfa/AuthenticatorMFA";
import { EmailDocument } from "@/app/libs/models/mfa/EmailMFA";
import MFAMethod from "@/app/libs/models/mfa/MFAMethod";
import MFAOption from "@/app/libs/models/mfa/MFAOption";
import SupportMFA from "@/app/libs/models/mfa/SupportMFA";
import Joi from "joi";
import hasFactor from "./hasMFAMethod";
import hasMFAMethod from "./hasMFAMethod";

export type FactorType = "authenticator" | "email";

const addMFA = async (
  data: { email?: EmailDocument; authenticator?: AuthenticatorDocument },
  option: { factor: FactorType; userId: string }
) => {
  console.log("=== DATAA ===", JSON.stringify(data));
  try {
    let validate;
    if (option.factor === "email" && data.email) {
      // Validate email
      validate = await Joi.object({
        emails: Joi.array()
          .items(
            Joi.object({
              value: Joi.string().email(),
              default: Joi.boolean().required(),
            })
          )
          .min(1)
          .required(),
      })
        .unknown(true)
        .validate(data.email);
    }

    if (option.factor === "authenticator") {
      // Validate authenticator
    }

    console.log("=== VALIDATEEE ===", validate);

    if (validate?.error) {
      return {
        error: { message: validate.error.details[0].message },
      };
    }

    // Get the user that wants to create mfa
    const user = await User.findById(option.userId);

    // Check the method he wants to create if we support it
    const supportedMethod = await SupportMFA.findOne({ method: option.factor });

    if (supportedMethod) {
      // Check to ensure that the user has not created this method before
      const userPopulate = await user.populate("mfamethods", {
        _id: 0,
        method: 1,
      });

      const userHasMFA = await hasMFAMethod(userPopulate, option.factor);
      if (userHasMFA)
        return {
          error: {
            message: `${option.factor} method has been added already"`,
          },
        };

      // Check if the user wants to create email mfa
      if (option.factor === "email") {
        // Create new email mfa
        const newEmailMFA = {
          // TODO: Consider setting default if it's the only one
          emails: data.email?.emails,
          message: validate?.value.message,
          enabled: true,
          seck: validate?.value.seck,
        };

        // Create new newMFAOption
        const newMFAOption = new MFAOption({
          email: newEmailMFA,
        });

        // Create a new mfamethod for user
        const newMFA = new MFAMethod({
          method: supportedMethod._id,
          user: option.userId,
          option: newMFAOption._id,
        });

        // Push to the user mfas
        user?.mfamethods.push(newMFA._id);

        // TODO: Save email mfa and user update
        await newMFAOption.save();
        await newMFA.save();
        await user.save();
      }

      // Check if the user wants to create authenticator mfa
      if (option.factor === "authenticator") {
        // Create new email mfa
        const newAuthenticatorMFA = {
          // TODO: Consider setting default if it's the only one
          authenticator: data.authenticator?.authenticators,
          message: data.authenticator?.message,
          enabled: data.authenticator?.enabled,
          seck: data.authenticator?.seck,
        };

        // Create new newMFAOption
        const newMFAOption = new MFAOption({
          authenticator: newAuthenticatorMFA,
        });

        // Create a new mfamethod for user
        const newMFA = new MFAMethod({
          method: supportedMethod._id,
          user: option.userId,
          option: newMFAOption._id,
        });

        // Push to the user mfas
        user?.mfamethods.push(newMFA._id);

        // TODO: Save email mfa and user update
        await newMFAOption.save();
        await newMFA.save();
        await user.save();
      }
    }
    return { user, status: 200 };
  } catch (error) {
    return {
      error: { message: (error as Error).message },
    };
  }
};

export default addMFA;
