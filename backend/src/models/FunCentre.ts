import mongoose, { Document, Schema } from 'mongoose';

export interface IFunCentre extends Document {
  enabled: boolean;
  title: string;
  description: string;
  games: {
    ticTacToe: {
      enabled: boolean;
      title: string;
      description: string;
    };
    memoryGame: {
      enabled: boolean;
      title: string;
      description: string;
    };
  };
  updatedAt: Date;
}

const FunCentreSchema: Schema = new Schema({
  enabled: {
    type: Boolean,
    required: true,
    default: true
  },
  title: {
    type: String,
    required: true,
    default: "Fun Centre"
  },
  description: {
    type: String,
    required: true,
    default: "Take a break and enjoy some interactive games while exploring my portfolio!"
  },
  games: {
    ticTacToe: {
      enabled: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        default: "Tic Tac Toe"
      },
      description: {
        type: String,
        default: "Classic Tic Tac Toe game. Challenge yourself!"
      }
    },
    memoryGame: {
      enabled: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        default: "Memory Game"
      },
      description: {
        type: String,
        default: "Test your memory with this card matching game."
      }
    }
  }
}, {
  timestamps: true
});

export default mongoose.model<IFunCentre>('FunCentre', FunCentreSchema);