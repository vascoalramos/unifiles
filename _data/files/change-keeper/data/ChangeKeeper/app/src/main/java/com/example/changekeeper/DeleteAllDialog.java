package com.example.changekeeper;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatDialogFragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

public class DeleteAllDialog extends AppCompatDialogFragment{
    //Class used to create a new category for incomes/expenses
    private DeleteAllDialogListener listener;

    static DeleteAllDialog newInstance() {
        return new DeleteAllDialog();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.layout_delete_files_dialog, null);
        View ultraView = view;


        Button butt  = view.findViewById(R.id.conf);
        butt.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                    listener.confirm();
                    dismiss();

            }
        });

        Button butt2  = view.findViewById(R.id.canc);
        butt2.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                dismiss();
            }
        });

        return view;
    }

    @Override
    public void onViewCreated(View view, @Nullable Bundle savedInstanceState) {

        super.onViewCreated(view, savedInstanceState);
        Log.i("oi","lol:)");
        getDialog().getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));

    }

    @Override
    public void onAttach(Context context) {
        super.onAttach(context);

        try {
            listener = (DeleteAllDialogListener) context;
        } catch (ClassCastException e) {
            throw new ClassCastException((context.toString() + "Did not implement FrequencyDialogueListener"));
        }
    }



    public interface DeleteAllDialogListener{
        void confirm();

    }

}


